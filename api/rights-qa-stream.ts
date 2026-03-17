import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { question, country = 'ireland' } = req.body as { question?: string; country?: string }

  if (!question?.trim()) {
    return res.status(400).json({ message: 'No question provided' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const STREAM_SYSTEM = country === 'ireland'
      ? `You are WorkGuard's employment rights advisor for Ireland (2026). Answer questions about employment rights in plain English with specific citations. Key 2026 facts: NMW €14.15/hr (20+, from 1 Jan 2026); SSP 5 days/yr at 70% (max €110/day); PRSI 4.2% employee (→4.35% Oct 2026); USC: 0.5%/€12,012, 2%/€28,700, 3%/€70,044, 8% above; PAYE 20% up to €44,000. Always mention the WRC (workplacerelations.ie) — free complaints, 6-month time limit.`
      : `You are WorkGuard's employment rights advisor for the UK (2026). Answer questions about employment rights in plain English with specific citations. Key 2026 facts: NLW £12.71/hr (21+, from April 2026); SSP £123.25/week from day one (no waiting days, from 6 April 2026); Employment Rights Act 2025 introduced day-one paternity rights from April 2026, unfair dismissal qualifying period reduces to 6 months from Jan 2027. Always mention ACAS (acas.org.uk) — free early conciliation before any tribunal claim.`

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: STREAM_SYSTEM,
      messages: [{ role: 'user', content: question }],
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Stream error:', error)
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
    res.end()
  }
}
