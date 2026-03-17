/**
 * Claude API client — all calls go through our serverless API routes
 * to keep the ANTHROPIC_API_KEY server-side only.
 */

import type { PayslipAnalysis, ContractAnalysis, RightsAnswer } from '@/types'

const API_BASE = '/api'

async function callApi<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(error.message || `API error ${response.status}`)
  }

  return response.json() as Promise<T>
}

// ─── Payslip Analysis ─────────────────────────────────────────────────────────

export async function analyzePayslip(
  text: string,
  country: 'ireland' | 'uk' = 'ireland'
): Promise<PayslipAnalysis> {
  return callApi<PayslipAnalysis>('analyze-payslip', { text, country })
}

// ─── Contract Analysis ────────────────────────────────────────────────────────

export async function analyzeContract(
  text: string,
  country: 'ireland' | 'uk' = 'ireland'
): Promise<ContractAnalysis> {
  return callApi<ContractAnalysis>('analyze-contract', { text, country })
}

// ─── Rights Q&A ───────────────────────────────────────────────────────────────

export async function askRightsQuestion(
  question: string,
  country: 'ireland' | 'uk' = 'ireland',
  sector?: string
): Promise<RightsAnswer> {
  return callApi<RightsAnswer>('rights-qa', { question, country, sector })
}

// ─── Streaming Rights Q&A ─────────────────────────────────────────────────────

export async function* streamRightsAnswer(
  question: string,
  country: 'ireland' | 'uk' = 'ireland',
  sector?: string
): AsyncGenerator<string> {
  const response = await fetch(`${API_BASE}/rights-qa-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, country, sector }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Stream error ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          if (parsed.text) yield parsed.text
        } catch {
          // ignore parse errors
        }
      }
    }
  }
}
