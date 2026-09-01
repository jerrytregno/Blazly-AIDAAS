export type AnalyzePayload = {
  domain: string
  score: number
  summary: string
  prompts: string[]
  recommendations: string[]
}

const MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
]

export function normalizeDomain(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    if (!parsed.hostname.includes('.')) return null
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return null
  }
}

function parseJsonSafe(text: string): unknown | null {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractJson(text: string): Omit<AnalyzePayload, 'domain'> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced?.[1] ?? text).trim()
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  return parseJsonSafe(candidate.slice(start, end + 1)) as Omit<AnalyzePayload, 'domain'> | null
}

function hideProviderNames(text: string) {
  return text
    .replace(/\bGoogle Gemini\b/gi, 'AI assistants')
    .replace(/\bGemini\b/gi, 'AI assistants')
}

function endpointsFor(apiKey: string, model: string) {
  const key = encodeURIComponent(apiKey)
  return [
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${key}`,
  ]
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

export async function runWebsiteAnalysis(
  apiKey: string,
  domain: string,
): Promise<AnalyzePayload> {
  const prompt = buildPrompt(domain)
  let lastError = 'Unable to analyze this website right now.'

  for (const model of MODELS) {
    for (const endpoint of endpointsFor(apiKey, model)) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: 'application/json',
            },
          }),
        })

        const raw = await response.text()
        const data = parseJsonSafe(raw) as {
          error?: { message?: string }
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        } | null

        if (!response.ok || !data) {
          lastError = data?.error?.message || lastError
          continue
        }

        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') || ''
        const parsed = extractJson(text)
        if (!parsed) {
          lastError = 'Could not read the analysis response.'
          continue
        }

        const prompts = (parsed.prompts || [])
          .map((p) => hideProviderNames(String(p).trim()))
          .filter(Boolean)
        const recommendations = (parsed.recommendations || [])
          .map((r) => hideProviderNames(String(r).trim()))
          .filter(Boolean)
        const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))

        if (prompts.length < 3) {
          lastError = 'Analysis returned incomplete results.'
          continue
        }

        return {
          domain,
          score,
          summary: hideProviderNames(
            parsed.summary?.trim() ||
              `${domain} currently scores ${score}/100 for AI discoverability.`,
          ),
          prompts: prompts.slice(0, 4),
          recommendations: recommendations.slice(0, 3),
        }
      } catch {
        lastError = 'Unable to analyze this website right now.'
      }
    }
  }

  throw new Error(lastError)
}
