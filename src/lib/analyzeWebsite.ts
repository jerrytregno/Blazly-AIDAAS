import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export type AnalyzeResult = {
  domain: string
  score: number
  summary: string
  prompts: string[]
  recommendations: string[]
}

function hideProviderNames(text: string) {
  return text
    .replace(/\bGoogle Gemini\b/gi, 'AI assistants')
    .replace(/\bGemini\b/gi, 'AI assistants')
}

function normalizeResult(domain: string, data: AnalyzeResult): AnalyzeResult {
  const prompts = (data.prompts || [])
    .map((p) => hideProviderNames(String(p).trim()))
    .filter(Boolean)
  const recommendations = (data.recommendations || [])
    .map((r) => hideProviderNames(String(r).trim()))
    .filter(Boolean)
  const score = Math.max(0, Math.min(100, Number(data.score) || 0))

  if (prompts.length < 3) {
    throw new Error('Analysis returned incomplete results.')
  }

  return {
    domain,
    score,
    summary: hideProviderNames(
      data.summary?.trim() || `${domain} currently scores ${score}/100 for AI discoverability.`,
    ),
    prompts: prompts.slice(0, 4),
    recommendations: recommendations.slice(0, 3),
  }
}

async function analyzeWithApi(domain: string): Promise<AnalyzeResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ website: domain }),
  })

  const raw = await response.text()
  let data: (AnalyzeResult & { error?: string }) | null = null

  try {
    data = JSON.parse(raw) as AnalyzeResult & { error?: string }
  } catch {
    throw new Error('Unable to analyze this website right now.')
  }

  if (!response.ok) {
    throw new Error(hideProviderNames(data.error || 'Unable to analyze this website right now.'))
  }

  return normalizeResult(domain, data)
}

export async function analyzeWebsite(domain: string): Promise<AnalyzeResult> {
  const result = await analyzeWithApi(domain)

  try {
    await addDoc(collection(db, 'websiteAnalyses'), {
      ...result,
      createdAt: serverTimestamp(),
      source: 'ai-daas-landing',
    })
  } catch {
    // Firestore rules may block writes until configured; analysis still returns.
  }

  return result
}
