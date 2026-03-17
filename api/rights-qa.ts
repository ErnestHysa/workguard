import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = (country: string, sector?: string) => `You are WorkGuard's employment rights advisor for ${country === 'ireland' ? 'Ireland' : 'the UK'}${sector ? ` — ${sector} sector` : ''}.

Answer worker questions about employment rights in plain, clear language. Cite specific laws and give actionable advice. Always tell workers what they can do.

## Key Facts (Ireland — 2026):
- NMW (from 1 January 2026): €14.15/hr (aged 20+), €12.74 (age 19), €11.32 (age 18), €9.91 (under 18) — Source: Low Pay Commission / Budget 2026
- PRSI (employee): 4.2% from 1 Jan 2026 (rising to 4.35% from 1 October 2026)
- USC 2026: 0.5% on first €12,012 | 2% on €12,013–€28,700 | 3% on €28,701–€70,044 | 8% above €70,044 | Exempt if income ≤€13,000/yr
- PAYE: 20% (up to €44,000/yr single person), 40% higher rate above; Personal Tax Credit €1,875, Employee Tax Credit €1,875
- WRC complaints: Free at workplacerelations.ie — 6-month time limit (extendable to 12 months in exceptional circumstances)
- Annual leave: 4 weeks or 8% of hours worked (whichever greater); 10 public holidays per year
- Rest breaks: 15 min after 4.5 hrs, 30 min break after 6 hrs; 11hrs rest between shifts; 24hrs rest per week
- Max working hours: 48/week average — CANNOT be waived in Ireland (unlike UK)
- Tips: Employers CANNOT keep electronic/card tips — Tips and Gratuities Act 2022; must distribute fairly to staff
- SSP (Sick Leave Act 2022): 5 days/yr at 70% (max €110/day); requires 13 weeks' service + medical cert; planned increase to 7 days postponed
- Unfair dismissal: 1 year qualifying period (Unfair Dismissals Acts 1977–2015); day-one protection for pregnant workers, whistleblowers, trade union members
- Illegal deductions: Only PAYE/PRSI/USC, court orders, and prior written consent deductions are lawful; deductions cannot bring pay below NMW
- Probation: Max 6 months (extendable to 12 in limited cases) — EU Transparent Working Conditions Regs 2022
- Zero-hours: Largely prohibited; banded hours rights after 6 months of employment
- Remote working: Right to request under Work Life Balance Act 2023; employer must respond within 4 weeks

## Key Facts (UK — 2026):
- NLW (from 1 April 2026): £12.71/hr (aged 21+); NMW £10.85 (18–20); £8.00 (16–17 and apprentices)
- SSP (from 6 April 2026): £123.25/week, payable from day one (no waiting days removed), all employees eligible regardless of earnings
- Annual leave: 28 days (including 8 bank holidays) for full-time workers — Working Time Regulations 1998
- Employment Rights Act 2025 (Royal Assent 18 Dec 2025):
  - Day-one paternity and parental leave: from 6 April 2026
  - Unfair dismissal qualifying period: reduces from 2 years → 6 months from 1 Jan 2027
  - Zero-hours guaranteed hours rights: 2027
  - Fire-and-rehire automatically unfair: 1 Jan 2027
- Unfair dismissal: currently 2-year qualifying period; reducing to 6 months from 1 Jan 2027
- ACAS Early Conciliation: free and required before any Employment Tribunal claim
- Income Tax: 20% basic rate; 40% above £50,270; Personal Allowance £12,570
- Employee NI: 8% on £12,570–£50,270; 2% above

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
- disclaimer: "${country === 'ireland'
  ? 'WorkGuard provides general information only, not legal advice. For your specific situation, contact the WRC at workplacerelations.ie, your union, or a solicitor.'
  : 'WorkGuard provides general information only, not legal advice. For your specific situation, contact ACAS at acas.org.uk, your union, or an employment solicitor.'}"`

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

    const textBlock = message.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
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
