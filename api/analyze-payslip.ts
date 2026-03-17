import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = (country: string) => `You are WorkGuard's payslip analysis AI. You analyse worker payslips and check for compliance with employment law in ${country === 'ireland' ? 'Ireland' : 'the UK'}.

You work FOR the worker. Your job is to identify underpayment, illegal deductions, and compliance issues.

## Irish Employment Law (key rules):
- National Minimum Wage: €13.50/hr (20+), €12.15 (age 19), €10.80 (age 18), €9.45 (under 18) — from Jan 2025
- Payment of Wages Act 1991: Only legal deductions are PAYE, PRSI, USC, court orders, written-consent deductions
- Illegal deductions: uniform without consent, till shortfalls without consent, breakages without consent
- Tips and Gratuities Act 2022: Employers cannot keep electronic tips
- Annual leave: 4 weeks or 8% of hours worked
- Statutory Sick Pay: 5 days/yr at 70% (max €110/day)

## Output: Return ONLY valid JSON with this exact schema:
{
  "employerName": string | null,
  "employeeName": string | null,
  "payPeriodStart": string | null,
  "payPeriodEnd": string | null,
  "grossPay": number,
  "netPay": number,
  "hoursWorked": number | null,
  "hourlyRate": number | null,
  "deductions": [{"name": string, "amount": number, "legal": boolean, "explanation": string}],
  "flags": [{"type": "ok"|"warning"|"violation", "category": string, "message": string, "detail": string, "legalBasis": string|null, "action": string|null}],
  "overallStatus": "ok"|"warning"|"violation",
  "summary": string,
  "totalPotentialUnderpayment": number | null
}

If data is missing, make reasonable inferences. If hourly rate is below NMW, flag as violation.
Always include at least one flag — even if just an "ok" status flag.`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { text, country = 'ireland' } = req.body as { text?: string; country?: string }

  if (!text?.trim()) {
    return res.status(400).json({ message: 'No payslip text provided' })
  }

  if (text.length > 50000) {
    return res.status(400).json({ message: 'Payslip text too long' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT(country),
      messages: [
        {
          role: 'user',
          content: `Please analyse this payslip:\n\n${text}`,
        },
      ],
    })

    // Extract text from response
    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI')
    }

    // Parse JSON — handle potential markdown code blocks
    const rawText = textBlock.text.trim()
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, rawText]
    const jsonStr = jsonMatch[1] || rawText

    const analysis = JSON.parse(jsonStr)
    return res.status(200).json(analysis)
  } catch (error) {
    console.error('Payslip analysis error:', error)
    if (error instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI returned invalid JSON. Please try again.' })
    }
    return res.status(500).json({ message: 'Analysis failed. Please try again.' })
  }
}
