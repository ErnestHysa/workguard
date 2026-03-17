import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = (country: string) => `You are WorkGuard's payslip analysis AI. You analyse worker payslips and check for compliance with employment law in ${country === 'ireland' ? 'Ireland' : 'the UK'}.

You work FOR the worker. Your job is to identify underpayment, illegal deductions, and compliance issues.

## Irish Employment Law — 2026 Key Rules:
- National Minimum Wage (from 1 January 2026): €14.15/hr (aged 20+), €12.74 (age 19), €11.32 (age 18), €9.91 (under 18) — Source: Low Pay Commission / Budget 2026
- PRSI (employee): 4.2% from 1 Jan 2026 (rising to 4.35% from 1 October 2026)
- USC 2026: 0.5% on first €12,012 | 2% on €12,013–€28,700 | 3% on €28,701–€70,044 | 8% above €70,044 | Exempt if income ≤€13,000/yr
- PAYE: 20% standard rate (up to €44,000/yr for single person); 40% higher rate above
- Payment of Wages Act 1991: Only legal deductions are PAYE, PRSI, USC, court/Revenue orders, written-consent deductions
- Illegal deductions (without prior written consent): uniform, till shortfalls, breakages, training costs
- Any deduction bringing pay below NMW is illegal regardless of consent
- Tips and Gratuities Act 2022: Employers CANNOT keep electronic/card tips — must distribute to staff
- Annual leave: 4 weeks or 8% of hours worked (whichever greater); 10 public holidays per year
- Statutory Sick Pay (Sick Leave Act 2022): 5 days/year at 70% of normal pay (max €110/day); requires 13 weeks' service + medical cert
- Max working hours: 48/week average (cannot be waived in Ireland)

## UK Employment Law — 2026 Key Rules:
- National Living Wage (from 1 April 2026): £12.71/hr (aged 21+); NMW: £10.85/hr (18–20); £8.00/hr (16–17 and apprentices)
- SSP (from 6 April 2026): £123.25/week, payable from day one (no waiting days), all employees eligible regardless of earnings
- Income Tax: 20% basic rate; 40% above £50,270; Personal Allowance £12,570
- Employee NI: 8% on earnings £12,570–£50,270; 2% above
- Annual leave: 28 days (including 8 bank holidays) for full-time workers — Working Time Regulations 1998
- Unlawful deductions: cannot take pay below NLW/NMW; uniform/till shortfall/training costs without written agreement are unlawful

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
      max_tokens: 8192,
      system: SYSTEM_PROMPT(country),
      messages: [
        {
          role: 'user',
          content: `Please analyse this payslip:\n\n${text}`,
        },
      ],
    })

    // Extract text from response
    const textBlock = message.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
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
