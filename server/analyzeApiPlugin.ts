import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

type AnalyzeBody = {
  website?: string
}

type GeminiPayload = {
  score: number
  summary: string
  prompts: string[]
  recommendations: string[]
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>,
) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function normalizeDomain(input: string) {
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

function extractJson(text: string): GeminiPayload | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced?.[1] ?? text).trim()
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as GeminiPayload
  } catch {
    return null
  }
}

async function analyzeWithGemini(apiKey: string, domain: string): Promise<GeminiPayload> {
  const prompt = `You are an AI Discoverability analyst for Blazly AI-DAAS.
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

  const models = [
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-flash-latest',
  ]
  let lastError = 'Gemini request failed'

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
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

    const data = (await response.json()) as {
      error?: { message?: string }
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }

    if (!response.ok) {
      lastError = data.error?.message || `Gemini error (${response.status}) for ${model}`
      continue
    }

    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n') || ''
    const parsed = extractJson(text)
    if (!parsed) {
      lastError = 'Could not parse Gemini response'
      continue
    }

    const prompts = (parsed.prompts || []).map((p) => String(p).trim()).filter(Boolean)
    const recommendations = (parsed.recommendations || [])
      .map((r) => String(r).trim())
      .filter(Boolean)
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))

    if (prompts.length < 3) {
      lastError = 'Gemini returned fewer than 3 prompts'
      continue
    }

    return {
      score,
      summary:
        parsed.summary?.trim() ||
        `${domain} currently scores ${score}/100 for AI discoverability.`,
      prompts: prompts.slice(0, 4),
      recommendations: recommendations.slice(0, 3),
    }
  }

  throw new Error(lastError)
}

export function analyzeApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'analyze-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/analyze') || req.method !== 'POST') {
          next()
          return
        }

        try {
          if (!apiKey) {
            sendJson(res, 500, {
              error: 'GEMINI_API_KEY is missing. Add it to your .env file.',
            })
            return
          }

          const body = (await readJson(req)) as AnalyzeBody
          const domain = normalizeDomain(body.website || '')
          if (!domain) {
            sendJson(res, 400, { error: 'Enter a valid website URL (e.g. yourcompany.com).' })
            return
          }

          const result = await analyzeWithGemini(apiKey, domain)
          sendJson(res, 200, { domain, ...result })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Analysis failed'
          sendJson(res, 502, { error: message })
        }
      })
    },
  }
}
