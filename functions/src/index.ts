import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { normalizeDomain, runWebsiteAnalysis } from './analyzeCore.js'

const geminiApiKey = defineSecret('GEMINI_API_KEY')

export const analyze = onRequest(
  {
    secrets: [geminiApiKey],
    cors: true,
    region: 'us-central1',
  },
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const apiKey = geminiApiKey.value()
    if (!apiKey) {
      res.status(500).json({ error: 'Analysis is not configured.' })
      return
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const domain = normalizeDomain(body?.website || '')
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
  },
)
