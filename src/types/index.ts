// ─── Payslip Analysis ───────────────────────────────────────────────────────

export interface PayslipFlag {
  type: 'ok' | 'warning' | 'violation'
  category: string
  message: string
  detail: string
  legalBasis?: string
  action?: string
}

export interface PayslipDeduction {
  name: string
  amount: number
  legal: boolean
  explanation: string
}

export interface PayslipAnalysis {
  employerName?: string
  employeeName?: string
  payPeriodStart?: string
  payPeriodEnd?: string
  grossPay: number
  netPay: number
  hoursWorked?: number
  hourlyRate?: number
  deductions: PayslipDeduction[]
  flags: PayslipFlag[]
  overallStatus: 'ok' | 'warning' | 'violation'
  summary: string
  totalPotentialUnderpayment?: number
}

// ─── Contract Analysis ───────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high'

export interface ContractClause {
  title: string
  risk: RiskLevel
  excerpt: string
  explanation: string
  legalContext: string
  concern?: string
}

export interface ContractOverview {
  role?: string
  employer?: string
  startDate?: string
  salary?: string
  contractType?: string
  jurisdiction?: string
}

export interface ContractAnalysis {
  overview: ContractOverview
  clauses: ContractClause[]
  redFlagCount: number
  summary: string
  threeThingsToKnow: string[]
  questionsToAsk: string[]
}

// ─── Shift Logger ─────────────────────────────────────────────────────────────

export interface Shift {
  id: string
  user_id: string
  start_time: string
  end_time?: string
  notes?: string
  duration_minutes?: number
  created_at: string
}

export interface PayPeriodComparison {
  id: string
  user_id: string
  period_start: string
  period_end: string
  logged_hours: number
  hourly_rate: number
  expected_pay: number
  actual_pay?: number
  discrepancy?: number
  discrepancy_percent?: number
  status: 'ok' | 'underpaid' | 'overpaid'
  payslip_id?: string
}

// ─── Rights Q&A ───────────────────────────────────────────────────────────────

export interface RightsAnswer {
  question: string
  answer: string
  sources: RightsSource[]
  relatedTopics: string[]
  disclaimer: string
}

export interface RightsSource {
  title: string
  url?: string
  act?: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  tags: string[]
}

// ─── User / Auth ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  country: 'ireland' | 'uk' | 'other'
  sector?: string
  role?: string
  hourly_rate?: number
  created_at: string
}

// ─── Payslip Record ───────────────────────────────────────────────────────────

export interface PayslipRecord {
  id: string
  user_id: string
  scanned_at: string
  employer_name?: string
  pay_period_start?: string
  pay_period_end?: string
  gross_pay?: number
  net_pay?: number
  status: 'ok' | 'warning' | 'violation'
  analysis: PayslipAnalysis
  file_url?: string
}

// ─── Contract Record ──────────────────────────────────────────────────────────

export interface ContractRecord {
  id: string
  user_id: string
  analysed_at: string
  employer_name?: string
  role?: string
  risk_level: RiskLevel
  analysis: ContractAnalysis
  file_url?: string
}

// ─── Violation Report ─────────────────────────────────────────────────────────

export interface ViolationReport {
  id: string
  user_id: string
  generated_at: string
  violation_type: string
  employer: string
  amount_owed?: number
  description: string
  evidence: string[]
  relevant_law: string
  next_steps: string[]
  wrc_link?: string
}
