import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, getAiModel } from './firebase'

export type AnalyzeResult = {
  domain: string
  score: number
  summary: string
  prompts: string[]
  recommendations: string[]
}

const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash']

function hideProviderNames(text: string) {
  return text
    .replace(/\bGoogle Gemini\b/gi, 'AI assistants')
    .replace(/\bGemini\b/gi, 'AI assistants')
}

function extractJson(text: string): Omit<AnalyzeResult, 'domain'> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced?.[1] ?? text).trim()
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as Omit<AnalyzeResult, 'domain'>
  } catch {
    return null
  }
}

function normalizeResult(domain: string, parsed: Omit<AnalyzeResult, 'domain'>): AnalyzeResult {
  const prompts = (parsed.prompts || [])
    .map((p) => hideProviderNames(String(p).trim()))
    .filter(Boolean)
  const recommendations = (parsed.recommendations || [])
    .map((r) => hideProviderNames(String(r).trim()))
    .filter(Boolean)
  const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))

  if (prompts.length < 3) {
    throw new Error('Analysis returned incomplete results.')
  }

  return {
    domain,
    score,
    summary: hideProviderNames(
      parsed.summary?.trim() || `${domain} currently scores ${score}/100 for AI discoverability.`,
    ),
    prompts: prompts.slice(0, 4),
    recommendations: recommendations.slice(0, 3),
  }
}

function buildPrompt(domain: string) {
  return `You are an AI Discoverability analyst for Blazly AI-DAAS.
Analyze the business website domain: ${domain}

Return ONLY valid JSON with this exact shape:
{
  "score": <integer 0-100 estimating how discoverable/recommendable this business is to AI assistants today>,
  "summary": "<one short sentence about the visibility score>",
  "prompts": ["<search prompt 1>", "<search prompt 2>", "<search prompt 3>", "<optional 4th>"],
  "recommendations": ["<short actionable recommendation 1>", "<short actionable recommendation 2>", "<short actionable recommendation 3>"]
}

Rules:
- prompts must be realistic buyer questions people would ask ChatGPT, Perplexity, or Claude (at least 3).
- recommendations must be concrete and specific to improving AI discoverability.
- Never mention hidden model provider names in the JSON values.
- Do not include markdown outside the JSON.`
}

async function analyzeWithFirebaseAi(domain: string): Promise<AnalyzeResult> {
  let lastError = 'Unable to analyze this website right now.'

  for (const modelName of MODELS) {
    try {
      const model = getAiModel(modelName)
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(domain) }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      })
      const text = response.response.text()
      const parsed = extractJson(text)
      if (!parsed) {
        lastError = 'Could not read the analysis response.'
        continue
      }
      return normalizeResult(domain, parsed)
    } catch (error) {
      lastError = error instanceof Error ? hideProviderNames(error.message) : lastError
    }
  }

  throw new Error(lastError)
}

async function analyzeWithLocalApi(domain: string): Promise<AnalyzeResult> {
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
  const attempts = import.meta.env.DEV
    ? [analyzeWithLocalApi, analyzeWithFirebaseAi]
    : [analyzeWithFirebaseAi, analyzeWithLocalApi]

  let result: AnalyzeResult | undefined
  let lastError: Error | undefined

  for (const attempt of attempts) {
    try {
      result = await attempt(domain)
      break
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unable to analyze this website right now.')
    }
  }

  if (!result) {
    throw lastError ?? new Error('Unable to analyze this website right now.')
  }

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
