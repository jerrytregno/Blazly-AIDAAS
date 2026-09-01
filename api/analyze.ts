import { normalizeDomain, runWebsiteAnalysis } from '../lib/analyzeCore.ts'

type AnalyzeBody = {
  website?: string
}

type HandlerRequest = {
  method?: string
  body?: AnalyzeBody
}

type HandlerResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => { json: (body: Record<string, unknown>) => void }
}

export default async function handler(req: HandlerRequest, res: HandlerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).json({})
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Analysis is not configured.' })
    return
  }

  const domain = normalizeDomain(req.body?.website || '')
  if (!domain) {
    res.status(400).json({ error: 'Enter a valid website URL (e.g. yourcompany.com).' })
    return
  }

  try {
    const result = await runWebsiteAnalysis(apiKey, domain)
    res.status(200).json(result)
  } catch {
    res.status(502).json({ error: 'Unable to analyze this website right now.' })
  }
}
