import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = (country: string, sector?: string) => `You are WorkGuard's employment rights advisor for ${country === 'ireland' ? 'Ireland' : 'the UK'}${sector ? ` — ${sector} sector` : ''}.

Answer worker questions about employment rights in plain, clear language. Cite specific laws and give actionable advice. Always tell workers what they can do.

## Key Facts (Ireland):
- NMW: €13.50/hr (20+), from Jan 2025
- WRC complaints: Free, online at workplacerelations.ie, 6-month time limit
- Annual leave: 4 weeks or 8% of hours
- Rest breaks: 15 min after 4.5 hrs, 30 min after 6 hrs
- Max hours: 48/week average
- Tips: Employers cannot keep electronic tips (Tips Act 2022)
- SSP: 5 days/yr at 70% (max €110/day)
- Unfair dismissal: 1 year qualifying period (with exceptions)
- Illegal deductions: Only PAYE/PRSI/USC + written consent deductions are lawful

## Output: Return ONLY valid JSON:
{
  "question": string,
  "answer": string,
  "sources": [{"title": string, "url": string|null, "act": string|null}],
  "relatedTopics": [string],
  "disclaimer": string
}

- answer: Plain English, 2-4 paragraphs, with specific figures and actionable steps
- sources: 2-4 authoritative sources (citizensinformation.ie, workplacerelations.ie, specific Acts)
- relatedTopics: 3-4 related topics the worker might want to know about
- disclaimer: "WorkGuard provides general information only, not legal advice. For your specific situation, contact the WRC at workplacerelations.ie, your union, or a solicitor."`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { question, country = 'ireland', sector } = req.body as {
    question?: string
    country?: string
    sector?: string
  }

  if (!question?.trim()) {
    return res.status(400).json({ message: 'No question provided' })
  }

  if (question.length > 2000) {
    return res.status(400).json({ message: 'Question too long' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT(country, sector),
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
    })

    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI')
    }

    const rawText = textBlock.text.trim()
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, rawText]
    const jsonStr = jsonMatch[1] || rawText

    const answer = JSON.parse(jsonStr)
    return res.status(200).json(answer)
  } catch (error) {
    console.error('Rights QA error:', error)
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI returned invalid response. Please try again.' })
    }
    return res.status(500).json({ message: 'Failed to get answer. Please try again.' })
  }
}
