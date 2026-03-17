import type { FAQ } from '@/types'

export const IRELAND_FAQS: FAQ[] = [
  {
    id: 'ie-01',
    category: 'Pay',
    question: 'What is the minimum wage in Ireland?',
    answer: 'The National Minimum Wage in Ireland is €13.50 per hour for workers aged 20 and over (from 1 January 2025). Workers aged 19 get €12.15/hr, age 18 gets €10.80/hr, and under 18 gets €9.45/hr. If you are paid less than this, your employer is breaking the law.',
    tags: ['minimum wage', 'pay', 'hourly rate']
  },
  {
    id: 'ie-02',
    category: 'Pay',
    question: 'Can my employer take money from my wages without asking?',
    answer: 'No. Under the Payment of Wages Act 1991, your employer can only deduct from your wages for: tax (PAYE, PRSI, USC), court orders, or deductions you have given written consent to. Deductions for things like uniform, breakages, till shortfalls, or "mistakes" are illegal without your written agreement.',
    tags: ['deductions', 'wages', 'payment of wages act']
  },
  {
    id: 'ie-03',
    category: 'Pay',
    question: 'Am I entitled to a payslip?',
    answer: 'Yes. Your employer must give you a payslip (written statement of wages) for every pay period. It must show your gross wages, deductions (and what they\'re for), and net pay. If you don\'t get a payslip, you can make a complaint to the WRC.',
    tags: ['payslip', 'pay statement', 'wages']
  },
  {
    id: 'ie-04',
    category: 'Tips',
    question: 'Can my employer keep my tips?',
    answer: 'No. Since the Tips and Gratuities Act 2022 came into force, employers cannot keep electronic tips or service charges that customers intend for staff. Tips must be distributed fairly among workers. Your employer must have a written tips policy and share it with staff. If your employer is keeping tips, this is illegal.',
    tags: ['tips', 'gratuities', 'service charge', 'hospitality']
  },
  {
    id: 'ie-05',
    category: 'Hours',
    question: 'What breaks am I entitled to?',
    answer: 'Under the Organisation of Working Time Act 1997: you are entitled to a 15-minute break after working 4.5 hours, and a 30-minute break after 6 hours. You are also entitled to 11 consecutive hours rest between working days, and 24 consecutive hours rest per week (usually Sunday).',
    tags: ['breaks', 'rest', 'working hours']
  },
  {
    id: 'ie-06',
    category: 'Hours',
    question: 'How many hours can I be made to work per week?',
    answer: 'Your employer cannot require you to work more than an average of 48 hours per week, calculated over a 4-month reference period. Night workers cannot work more than an average of 8 hours per night. If you are consistently working more than 48 hours, you may have grounds for a WRC complaint.',
    tags: ['working hours', 'maximum hours', 'overtime']
  },
  {
    id: 'ie-07',
    category: 'Leave',
    question: 'How much annual leave am I entitled to?',
    answer: 'You are entitled to 4 weeks paid annual leave per year, OR 8% of the hours you worked, whichever is greater. For part-time workers, the 8% rule usually applies. You also get 10 public holidays per year. Holiday pay must be paid at your normal weekly wage rate (including regular overtime and commission).',
    tags: ['annual leave', 'holidays', 'vacation']
  },
  {
    id: 'ie-08',
    category: 'Sick Pay',
    question: 'Am I entitled to sick pay?',
    answer: 'Yes. Under the Sick Leave Act 2022, employees are entitled to statutory sick pay of 70% of normal wages (up to €110/day) for up to 5 sick days per year (2024). You need to be an employee (not a contractor) and provide a medical certificate after 2 days. Your employer may offer a better sick pay scheme.',
    tags: ['sick pay', 'sick leave', 'illness']
  },
  {
    id: 'ie-09',
    category: 'Contracts',
    question: 'What must be in my contract of employment?',
    answer: 'Under the Terms of Employment (Information) Act 1994, your employer must give you a written statement of your core terms within 5 days of starting. This must include: job title, start date, rate of pay, hours of work, location, annual leave entitlement, notice periods, and details of any probation. If you don\'t receive this, it\'s a breach of law.',
    tags: ['contract', 'terms of employment', 'written statement']
  },
  {
    id: 'ie-10',
    category: 'Contracts',
    question: 'Can my employer enforce a non-compete clause?',
    answer: 'Irish courts apply a "reasonableness" test to non-compete clauses. They look at: the duration (typically 6-12 months max; 2+ years is very hard to enforce), geographic scope (must be proportionate), and whether it protects a genuine business interest. A blanket non-compete that would stop you working in your field entirely is unlikely to be enforceable.',
    tags: ['non-compete', 'contract', 'post-employment']
  },
  {
    id: 'ie-11',
    category: 'Dismissal',
    question: 'What protection do I have against unfair dismissal?',
    answer: 'Under the Unfair Dismissals Act 1977-2015, you have the right not to be unfairly dismissed once you have 1 year of continuous service. Your employer must have a valid reason for dismissal (e.g., performance, redundancy, conduct) and follow fair procedures. You can make a complaint to the WRC within 6 months of dismissal. Certain categories (whistleblowers, pregnant workers) have protection from day one.',
    tags: ['dismissal', 'unfair dismissal', 'redundancy']
  },
  {
    id: 'ie-12',
    category: 'WRC',
    question: 'How do I make a complaint to the WRC?',
    answer: 'You can make a complaint online for free at workplacerelations.ie. You typically have 6 months from the date of the breach (can be extended to 12 months in exceptional circumstances). The WRC will attempt mediation first, then a formal adjudication hearing if needed. You don\'t need a solicitor. If you win, you can be awarded up to 2 years pay plus orders for compliance.',
    tags: ['WRC', 'complaint', 'workplace relations commission', 'rights']
  },
  {
    id: 'ie-13',
    category: 'Pay',
    question: 'My employer says I\'m self-employed but I work like an employee. What are my rights?',
    answer: 'This is called "bogus self-employment." Irish law looks at the reality of your work relationship, not what your contract says. Indicators you may be an employee include: fixed hours, working mainly for one employer, using their equipment, being told how to do the work. If you\'re misclassified, you may be entitled to employee rights and your employer owes PRSI contributions. Contact the WRC or Revenue.',
    tags: ['self-employment', 'bogus self-employment', 'employment status']
  },
  {
    id: 'ie-14',
    category: 'Hours',
    question: 'I\'m on a zero hours contract. What are my rights?',
    answer: 'The Employment (Miscellaneous Provisions) Act 2018 introduced "banded hours" rights. After 6 months, if you consistently work more hours than your contract states, you can request to be placed in a higher band that reflects your average hours. Zero-hours contracts are largely banned except for genuine casual work or emergency situations.',
    tags: ['zero hours', 'banded hours', 'part-time']
  },
  {
    id: 'ie-15',
    category: 'Pay',
    question: 'My employer hasn\'t paid me. What can I do?',
    answer: 'First, raise it in writing with your employer. If not resolved, you can make a complaint to the WRC under the Payment of Wages Act 1991. You can claim up to 6 months of unpaid wages. The WRC has the power to order your employer to pay. If your employer is insolvent, the Insolvency Payments Scheme may cover some unpaid wages. Act quickly — there are time limits.',
    tags: ['unpaid wages', 'wage theft', 'payment']
  },
  {
    id: 'ie-16',
    category: 'Leave',
    question: 'Am I entitled to maternity leave?',
    answer: 'Yes. You are entitled to 26 weeks of maternity leave, plus an optional 16 weeks of additional maternity leave. Maternity Benefit (paid by the DSP) is €289 per week for the first 26 weeks if you have enough PRSI contributions. Your job is protected while on maternity leave. You must give your employer at least 4 weeks\' written notice.',
    tags: ['maternity leave', 'pregnancy', 'family leave']
  },
  {
    id: 'ie-17',
    category: 'Pay',
    question: 'My employer is charging me for my uniform. Is this legal?',
    answer: 'Uniform deductions are only legal if you have given prior written consent. If your employer deducts uniform costs without your written agreement, this is an illegal deduction under the Payment of Wages Act 1991. Also, deductions cannot take your wages below the national minimum wage.',
    tags: ['uniform', 'deductions', 'wages']
  },
  {
    id: 'ie-18',
    category: 'Dismissal',
    question: 'Can I be dismissed during my probation?',
    answer: 'Your employer has more flexibility to dismiss during probation, but must still follow fair procedures. Under 2024 regulations, probation is capped at 6 months (can extend to 12 with notice in limited circumstances). You still have rights against discrimination, unfair treatment related to protected characteristics, and you can still make certain WRC claims even during probation.',
    tags: ['probation', 'dismissal', 'contract']
  },
  {
    id: 'ie-19',
    category: 'Pay',
    question: 'Am I entitled to overtime pay?',
    answer: 'There is no statutory right to overtime pay in Ireland — it depends on your contract. However, your employer cannot require you to work more than 48 hours average per week, and any deductions that bring your pay below minimum wage are illegal. Check your contract carefully for overtime terms.',
    tags: ['overtime', 'pay', 'hours']
  },
  {
    id: 'ie-20',
    category: 'Tips',
    question: 'My employer takes service charges but says they\'re for the business. Is this legal?',
    answer: 'Under the Tips and Gratuities Act 2022, if a service charge is charged to customers in a way that reasonably leads them to believe it will go to staff, it MUST be distributed to staff. Employers must display a tips policy, and electronic tips cannot be withheld. If a service charge is genuinely described as a business charge (e.g., administration fee), it may not need to be distributed, but this must be clearly communicated to customers.',
    tags: ['tips', 'service charge', 'gratuities', 'hospitality']
  }
]
