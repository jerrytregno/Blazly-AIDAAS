import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'
import { normalizeDomain, runWebsiteAnalysis } from '../lib/analyzeCore.ts'

type AnalyzeBody = {
  website?: string
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

function attachAnalyzeRoute(
  server: Pick<ViteDevServer, 'middlewares'>,
  apiKey: string | undefined,
) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith('/api/analyze') || req.method !== 'POST') {
      next()
      return
    }

    try {
      if (!apiKey) {
        sendJson(res, 500, {
          error: 'Analysis is not configured. Add the API key to your .env file.',
        })
        return
      }

      const body = (await readJson(req)) as AnalyzeBody
      const domain = normalizeDomain(body.website || '')
      if (!domain) {
        sendJson(res, 400, { error: 'Enter a valid website URL (e.g. yourcompany.com).' })
        return
      }

      const result = await runWebsiteAnalysis(apiKey, domain)
      sendJson(res, 200, result)
    } catch {
      sendJson(res, 502, { error: 'Unable to analyze this website right now.' })
    }
  })
}

export function analyzeApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'analyze-api',
    configureServer(server) {
      attachAnalyzeRoute(server, apiKey)
    },
    configurePreviewServer(server) {
      attachAnalyzeRoute(server, apiKey)
    },
  }
}
