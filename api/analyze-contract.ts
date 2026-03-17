import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = (country: string) => `You are WorkGuard's employment contract analysis AI. You review employment contracts FOR the worker — your job is to identify clauses they should be aware of before signing.

## Jurisdiction: ${country === 'ireland' ? 'Ireland' : 'UK'}

### Irish Context:
- Non-compete clauses: No statutory limit; courts apply reasonableness test. 6-12 months typically reasonable. 2+ years likely unenforceable.
- Deductions: Must have written consent; cannot take below minimum wage
- Garden leave: Worker must be paid during garden leave
- Right-to-search: Must have written consent; must be proportionate
- Probation: Max 6 months (extendable to 12 months with notice in limited cases) — workers still have basic rights during probation
- Secondary employment: Restrictions must be proportionate
- Intellectual property: Broad IP assignments should be scrutinised

## Output: Return ONLY valid JSON:
{
  "overview": {
    "role": string|null,
    "employer": string|null,
    "startDate": string|null,
    "salary": string|null,
    "contractType": string|null,
    "jurisdiction": string
  },
  "clauses": [
    {
      "title": string,
      "risk": "low"|"medium"|"high",
      "excerpt": string,
      "explanation": string,
      "legalContext": string,
      "concern": string|null
    }
  ],
  "redFlagCount": number,
  "summary": string,
  "threeThingsToKnow": [string, string, string],
  "questionsToAsk": [string]
}

- "high" risk: Potentially unenforceable, unusually broad, or harmful clauses
- "medium" risk: Worth clarifying before signing
- "low" risk: Standard clauses, normal terms
- redFlagCount: number of high-risk clauses
- threeThingsToKnow: Three plain-English things the worker should know before signing
- questionsToAsk: 3-5 specific questions to ask the employer`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { text, country = 'ireland' } = req.body as { text?: string; country?: string }

  if (!text?.trim()) {
    return res.status(400).json({ message: 'No contract text provided' })
  }

  if (text.length > 100000) {
    return res.status(400).json({ message: 'Contract too long. Please paste the most relevant sections.' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT(country),
      messages: [
        {
          role: 'user',
          content: `Please analyse this employment contract:\n\n${text}`,
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

    const analysis = JSON.parse(jsonStr)
    return res.status(200).json(analysis)
  } catch (error) {
    console.error('Contract analysis error:', error)
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI returned invalid JSON. Please try again.' })
    }
    return res.status(500).json({ message: 'Analysis failed. Please try again.' })
  }
}
