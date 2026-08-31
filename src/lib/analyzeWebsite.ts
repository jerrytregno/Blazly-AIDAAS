import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, getGeminiModel } from './firebase'

export type AnalyzeResult = {
  domain: string
  score: number
  summary: string
  prompts: string[]
  recommendations: string[]
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
  const prompts = (parsed.prompts || []).map((p) => String(p).trim()).filter(Boolean)
  const recommendations = (parsed.recommendations || [])
    .map((r) => String(r).trim())
    .filter(Boolean)
  const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))

  if (prompts.length < 3) {
    throw new Error('Analysis returned fewer than 3 search prompts.')
  }

  return {
    domain,
    score,
    summary:
      parsed.summary?.trim() ||
      `${domain} currently scores ${score}/100 for AI discoverability.`,
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
- prompts must be realistic buyer questions people would ask ChatGPT/Gemini/Perplexity (at least 3).
- recommendations must be concrete and specific to improving AI discoverability.
- Do not include markdown outside the JSON.`
}

async function analyzeWithFirebaseAi(domain: string): Promise<AnalyzeResult> {
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash-lite']
  let lastError = 'Firebase Gemini request failed'

  for (const modelName of models) {
    try {
      const model = getGeminiModel(modelName)
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
        lastError = 'Could not parse Gemini response'
        continue
      }
      return normalizeResult(domain, parsed)
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
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
  const data = (await response.json()) as AnalyzeResult & { error?: string }
  if (!response.ok) {
    throw new Error(data.error || 'Unable to analyze this website right now.')
  }
  return normalizeResult(domain, data)
}

export async function analyzeWebsite(domain: string): Promise<AnalyzeResult> {
  let result: AnalyzeResult

  try {
    result = await analyzeWithFirebaseAi(domain)
  } catch {
    result = await analyzeWithLocalApi(domain)
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
