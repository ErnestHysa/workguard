import type { FAQ } from '@/types'

export const IRELAND_FAQS: FAQ[] = [
  {
    id: 'ie-01',
    category: 'Pay',
    question: 'What is the minimum wage in Ireland?',
    answer: 'The National Minimum Wage in Ireland is €14.15 per hour for workers aged 20 and over (from 1 January 2026). Workers aged 19 get €12.74/hr, age 18 gets €11.32/hr, and under 18 gets €9.91/hr. If you are paid less than this, your employer is breaking the law. You can make a free complaint to the WRC at workplacerelations.ie.',
    tags: ['minimum wage', 'pay', 'hourly rate']
  },
  {
    id: 'ie-02',
    category: 'Pay',
    question: 'Can my employer take money from my wages without asking?',
    answer: 'No. Under the Payment of Wages Act 1991, your employer can only deduct from your wages for: tax (PAYE, PRSI, USC), court orders, or deductions you have given prior written consent to. Deductions for things like uniform, breakages, till shortfalls, or training costs are illegal without your prior written agreement — and even with consent, deductions cannot bring your pay below the minimum wage (€14.15/hr from January 2026).',
    tags: ['deductions', 'wages', 'payment of wages act']
  },
  {
    id: 'ie-03',
    category: 'Pay',
    question: 'Am I entitled to a payslip?',
    answer: 'Yes. Your employer must give you a payslip (written statement of wages) for every pay period. It must show your gross wages, all deductions (and what they\'re for), and your net pay. If you don\'t get a payslip, or if the payslip doesn\'t match what you actually received, you can make a free complaint to the WRC at workplacerelations.ie.',
    tags: ['payslip', 'pay statement', 'wages']
  },
  {
    id: 'ie-04',
    category: 'Tips',
    question: 'Can my employer keep my tips?',
    answer: 'No. Since the Payment of Wages (Amendment) (Tips and Gratuities) Act 2022, employers cannot keep electronic or card tips — these must be distributed to workers. Your employer must have a written tips policy displayed for customers and staff. Cash tips are also covered if charged in a way that makes customers believe they go to staff. If your employer is withholding tips, this is illegal and you can complain to the WRC.',
    tags: ['tips', 'gratuities', 'service charge', 'hospitality']
  },
  {
    id: 'ie-05',
    category: 'Hours',
    question: 'What breaks am I entitled to?',
    answer: 'Under the Organisation of Working Time Act 1997: you are entitled to a 15-minute break after working 4.5 hours, and a 30-minute break after 6 hours (the 30 minutes includes the first 15). You are also entitled to at least 11 consecutive hours rest between working days, and at least 24 consecutive hours rest per week (normally Sunday). These are legal minimums — your contract may give you more.',
    tags: ['breaks', 'rest', 'working hours']
  },
  {
    id: 'ie-06',
    category: 'Hours',
    question: 'How many hours can I be made to work per week?',
    answer: 'Under the Organisation of Working Time Act 1997, your employer cannot require you to work more than an average of 48 hours per week, calculated over a 4-month reference period. Unlike the UK, Irish workers cannot waive this right. Night workers cannot work more than an average of 8 hours per night. If you are consistently working more than 48 hours, you can make a WRC complaint.',
    tags: ['working hours', 'maximum hours', 'overtime']
  },
  {
    id: 'ie-07',
    category: 'Leave',
    question: 'How much annual leave am I entitled to?',
    answer: 'You are entitled to 4 weeks paid annual leave per year, OR 8% of the hours you worked — whichever is greater. For part-time workers, the 8% rule usually gives more. You also get 10 public holidays per year (New Year\'s Day, St. Brigid\'s Day, St. Patrick\'s Day, Easter Monday, May Day, June/August/October bank holidays, Christmas Day, St. Stephen\'s Day). Holiday pay must be at your normal weekly wage rate, including regular overtime.',
    tags: ['annual leave', 'holidays', 'vacation', 'public holidays']
  },
  {
    id: 'ie-08',
    category: 'Sick Pay',
    question: 'Am I entitled to sick pay?',
    answer: 'Yes. Under the Sick Leave Act 2022, employees are entitled to statutory sick pay (SSP) of 70% of normal daily wages, up to a maximum of €110 per day, for up to 5 sick days per calendar year in 2026. (Note: a planned increase to 7 days has been postponed pending government review.) You need at least 13 weeks\' continuous service and must provide a medical certificate. After SSP is exhausted, Illness Benefit from the Department of Social Protection may apply (from day 4, after 3 waiting days).',
    tags: ['sick pay', 'sick leave', 'illness', 'SSP']
  },
  {
    id: 'ie-09',
    category: 'Contracts',
    question: 'What must be in my contract of employment?',
    answer: 'Under the Terms of Employment (Information) Act 1994 (as amended by the 2022 EU Transparent and Predictable Working Conditions Regulations), your employer must give you a written statement of your core terms within 5 days of starting. This must include: job title, start date, rate of pay, hours of work, location, annual leave entitlement, notice periods, probation details, and details of any collective agreements. Failure to provide this is a breach of law reportable to the WRC.',
    tags: ['contract', 'terms of employment', 'written statement']
  },
  {
    id: 'ie-10',
    category: 'Contracts',
    question: 'Can my employer enforce a non-compete clause?',
    answer: 'Irish courts apply a strict "reasonableness" test to non-compete clauses. The clause must: (1) protect a genuine business interest (trade secrets, customer connections), (2) be reasonable in duration — typically 6–12 months; 2+ years is almost never enforced, (3) be proportionate in geographic scope, and (4) not simply prevent you from earning a living. Courts will NOT rewrite an overly broad clause to rescue it — it must be valid as written. Paid garden leave during the restriction period makes enforcement more likely.',
    tags: ['non-compete', 'contract', 'post-employment', 'garden leave']
  },
  {
    id: 'ie-11',
    category: 'Dismissal',
    question: 'What protection do I have against unfair dismissal?',
    answer: 'Under the Unfair Dismissals Acts 1977–2015, you have the right not to be unfairly dismissed once you have 1 year of continuous service. Your employer must have a valid reason (performance, conduct, redundancy) AND follow fair procedures. You must make a WRC complaint within 6 months of dismissal (extendable to 12 months in exceptional circumstances). From day one, certain categories have protection regardless of service: pregnant workers, whistleblowers, trade union members, and those reporting discrimination.',
    tags: ['dismissal', 'unfair dismissal', 'redundancy']
  },
  {
    id: 'ie-12',
    category: 'WRC',
    question: 'How do I make a complaint to the WRC?',
    answer: 'You can make a complaint online for free at workplacerelations.ie — no solicitor required. You typically have 6 months from the date of the breach to make a complaint (this can be extended to 12 months in exceptional circumstances). The WRC will try mediation first; if that fails, it goes to an adjudication hearing. If you win, you can be awarded up to 2 years\' pay plus compliance orders. The WRC can also enforce any orders made against an employer.',
    tags: ['WRC', 'complaint', 'workplace relations commission', 'rights']
  },
  {
    id: 'ie-13',
    category: 'Pay',
    question: 'My employer says I\'m self-employed but I work like an employee. What are my rights?',
    answer: 'This is called "bogus self-employment." Irish law looks at the reality of your working relationship, not just what your contract says. Indicators that you may be an employee: fixed hours set by the employer, working mainly for one company, using their equipment, being told how to do the work, no ability to subcontract. If you\'re misclassified, you may be entitled to full employee rights (NMW, annual leave, SSP, unfair dismissal protection) and your employer owes backdated PRSI contributions. Contact the WRC or Revenue.',
    tags: ['self-employment', 'bogus self-employment', 'employment status']
  },
  {
    id: 'ie-14',
    category: 'Hours',
    question: 'I\'m on a zero hours contract. What are my rights?',
    answer: 'Zero-hours contracts are largely prohibited under the Employment (Miscellaneous Provisions) Act 2018, except for genuine casual work or emergency situations. After 6 months, if you consistently work more hours than your contract states, you have the right to request a "banded hours" contract that reflects your actual average hours worked. Hour bands are: 3–6, 6–11, 11–16, 16–21, 21–26, 26–31, 31–36, and 36+hrs/week. Your employer has 4 weeks to respond.',
    tags: ['zero hours', 'banded hours', 'part-time', 'casual work']
  },
  {
    id: 'ie-15',
    category: 'Pay',
    question: 'My employer hasn\'t paid me. What can I do?',
    answer: 'First, raise it in writing with your employer (keep a copy). If not resolved within a reasonable time, make a complaint to the WRC under the Payment of Wages Act 1991 — this is free at workplacerelations.ie. You can claim up to 6 months of unpaid wages. The WRC can order your employer to pay. If your employer is insolvent, the Insolvency Payments Scheme may cover some unpaid wages up to statutory limits. Act quickly — the 6-month time limit starts from each missed payment.',
    tags: ['unpaid wages', 'wage theft', 'payment']
  },
  {
    id: 'ie-16',
    category: 'Leave',
    question: 'Am I entitled to maternity leave?',
    answer: 'Yes. You are entitled to 26 weeks of maternity leave, plus an optional 16 weeks of additional unpaid maternity leave. Maternity Benefit (paid by the Department of Social Protection, not your employer) is €299/week for the first 26 weeks from 1 January 2026, provided you have sufficient PRSI contributions. Your job is fully protected while on maternity leave. You must notify your employer at least 4 weeks in advance in writing. Paternity leave is 2 weeks (Paternity Benefit €299/week from 1 January 2026). Parent\'s Leave is 9 weeks per parent (Parent\'s Benefit €299/week).',
    tags: ['maternity leave', 'pregnancy', 'family leave', 'paternity leave']
  },
  {
    id: 'ie-17',
    category: 'Pay',
    question: 'My employer is charging me for my uniform. Is this legal?',
    answer: 'Uniform deductions are only lawful under the Payment of Wages Act 1991 if you have given prior written consent before the deduction is made. If your employer deducts uniform costs without your prior written agreement, this is an illegal deduction and you can complain to the WRC. Even with consent, deductions cannot bring your wages below the National Minimum Wage (€14.15/hr from 1 January 2026). The same rules apply to equipment, tools, or any other work-related costs.',
    tags: ['uniform', 'deductions', 'wages', 'minimum wage']
  },
  {
    id: 'ie-18',
    category: 'Dismissal',
    question: 'Can I be dismissed during my probation?',
    answer: 'Under the European Communities (Transparent and Predictable Working Conditions) Regulations 2022, probation is capped at 6 months, extendable to 12 months in limited circumstances (such as extended sick leave during probation). Your employer has more flexibility to dismiss during probation, but must still act fairly. Crucially, you still have rights during probation: protection from discrimination (from day one), right to the National Minimum Wage (€14.15/hr), right to SSP (after 13 weeks\' service), and right to written notice. The WRC can hear discrimination claims from day one regardless of probation.',
    tags: ['probation', 'dismissal', 'contract', 'rights during probation']
  },
  {
    id: 'ie-19',
    category: 'Pay',
    question: 'Am I entitled to overtime pay?',
    answer: 'There is no statutory right to overtime pay in Ireland — your entitlement depends entirely on your contract of employment. However, there are important protections: your employer cannot require you to work more than an average of 48 hours per week (Organisation of Working Time Act 1997), and any deductions that bring your effective hourly rate below €14.15/hr (from January 2026) are illegal regardless of consent. Check your contract carefully. If your contract provides for overtime pay, your employer must honour it.',
    tags: ['overtime', 'pay', 'hours', 'contract']
  },
  {
    id: 'ie-20',
    category: 'Tips',
    question: 'My employer takes service charges but says they\'re for the business. Is this legal?',
    answer: 'Under the Payment of Wages (Amendment) (Tips and Gratuities) Act 2022, if a service charge is levied in a way that reasonably leads customers to believe it will go to staff, it MUST be distributed to workers. Employers must display their tips policy prominently, and electronic/card tips cannot be withheld under any circumstances. If the service charge is genuinely described as an administration or booking fee (and this is clearly communicated to customers before they pay), the rules may differ — but this must be explicit, not assumed. If you suspect tips are being withheld, make a free complaint to the WRC.',
    tags: ['tips', 'service charge', 'gratuities', 'hospitality', 'tips act 2022']
  }
]
