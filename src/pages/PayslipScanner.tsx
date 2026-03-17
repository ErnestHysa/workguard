import { useState } from 'react'
import { FileText, CheckCircle, AlertTriangle, XCircle, Download, ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '@/components/Layout'
import UploadZone from '@/components/UploadZone'
import FlagBadge from '@/components/FlagBadge'
import LoadingSpinner from '@/components/LoadingSpinner'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { extractTextFromFile } from '@/lib/ocr'
import { analyzePayslip } from '@/lib/claude'
import type { PayslipAnalysis } from '@/types'

type Step = 'upload' | 'extracting' | 'analysing' | 'result' | 'manual'

const statusConfig = {
  ok: { icon: CheckCircle, label: 'All Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  warning: { icon: AlertTriangle, label: 'Needs Review', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  violation: { icon: XCircle, label: 'Possible Violation', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
}

export default function PayslipScanner() {
  const [step, setStep] = useState<Step>('upload')
  const [manualText, setManualText] = useState('')
  const [analysis, setAnalysis] = useState<PayslipAnalysis | null>(null)
  const [error, setError] = useState('')
  const [showDeductions, setShowDeductions] = useState(false)

  const processText = async (text: string) => {
    setStep('analysing')
    setError('')
    try {
      const result = await analyzePayslip(text, 'ireland')
      setAnalysis(result)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setStep('upload')
    }
  }

  const handleFile = async (file: File) => {
    setStep('extracting')
    setError('')
    try {
      const text = await extractTextFromFile(file)
      if (!text.trim()) throw new Error('Could not extract text from file. Please try the manual entry option.')
      await processText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read file')
      setStep('upload')
    }
  }

  const handleManualSubmit = async () => {
    if (!manualText.trim()) return
    await processText(manualText)
  }

  const reset = () => {
    setStep('upload')
    setAnalysis(null)
    setError('')
    setManualText('')
  }

  const statusInfo = analysis ? statusConfig[analysis.overallStatus] : null

  return (
    <Layout title="Payslip Scanner" showBack>
      <div className="space-y-4">
        <DisclaimerBanner />

        {/* Upload Step */}
        {step === 'upload' && (
          <>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}
            <UploadZone
              onFile={handleFile}
              label="Upload your payslip"
            />
            <div className="text-center">
              <button
                onClick={() => setStep('manual')}
                className="text-brand-400 text-sm underline"
              >
                Enter payslip details manually instead
              </button>
            </div>
          </>
        )}

        {/* Manual Entry */}
        {step === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Paste or type your payslip details
              </label>
              <textarea
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Include: employer name, your name, pay period dates, gross pay, net pay, all deductions listed, hours worked, hourly rate..."
                rows={10}
                className="input-field resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('upload')} className="btn-secondary flex-1">
                Back
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={!manualText.trim()}
                className="btn-primary flex-1"
              >
                Analyse
              </button>
            </div>
          </div>
        )}

        {/* Extracting */}
        {step === 'extracting' && (
          <LoadingSpinner
            message="Reading your payslip..."
            subMessage="Extracting text from document"
          />
        )}

        {/* Analysing */}
        {step === 'analysing' && (
          <LoadingSpinner
            message="Analysing your payslip..."
            subMessage="Checking against Irish employment law"
          />
        )}

        {/* Result */}
        {step === 'result' && analysis && statusInfo && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={`card p-5 ${statusInfo.bg} border ${statusInfo.border}`}>
              <div className="flex items-center gap-3 mb-2">
                <statusInfo.icon size={28} className={statusInfo.color} />
                <div>
                  <h2 className="font-bold text-white text-lg">{statusInfo.label}</h2>
                  {analysis.employerName && (
                    <p className="text-slate-400 text-sm">{analysis.employerName}</p>
                  )}
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
              {analysis.totalPotentialUnderpayment && analysis.totalPotentialUnderpayment > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-red-300 font-semibold text-sm">
                    ⚠️ Potential underpayment: €{analysis.totalPotentialUnderpayment.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Pay Breakdown */}
            <div className="card p-4 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileText size={16} className="text-brand-400" />
                Pay Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Gross Pay</span>
                  <span className="text-white font-medium">€{analysis.grossPay.toFixed(2)}</span>
                </div>
                {analysis.hoursWorked && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Hours Worked</span>
                    <span className="text-white font-medium">{analysis.hoursWorked}h</span>
                  </div>
                )}
                {analysis.hourlyRate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Effective Rate</span>
                    <span className="text-white font-medium">€{analysis.hourlyRate.toFixed(2)}/hr</span>
                  </div>
                )}

                {/* Deductions toggle */}
                {analysis.deductions.length > 0 && (
                  <>
                    <button
                      onClick={() => setShowDeductions(!showDeductions)}
                      className="flex items-center justify-between w-full text-sm text-slate-400 hover:text-white py-1"
                    >
                      <span>Deductions ({analysis.deductions.length})</span>
                      {showDeductions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showDeductions && analysis.deductions.map((d, i) => (
                      <div key={i} className={`flex justify-between text-sm pl-3 ${!d.legal ? 'text-red-300' : ''}`}>
                        <span className="text-slate-400">{d.name} {!d.legal && '⚠️'}</span>
                        <span>-€{d.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

                <div className="h-px bg-slate-700" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-white">Net Pay</span>
                  <span className="font-bold text-white">€{analysis.netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Flags */}
            {analysis.flags.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Findings ({analysis.flags.length})
                </h3>
                {analysis.flags.map((flag, i) => (
                  <FlagBadge key={i} flag={flag} />
                ))}
              </div>
            )}

            {/* Actions */}
            {analysis.overallStatus === 'violation' && (
              <div className="card p-4 space-y-3 border-red-500/30">
                <h3 className="font-semibold text-white">What to do next</h3>
                <p className="text-slate-300 text-sm">
                  If you believe your rights have been violated, you can make a free complaint to the Workplace Relations Commission.
                </p>
                <a
                  href="https://www.workplacerelations.ie/en/complaints_disputes/refer_a_dispute_make_a_complaint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Make a WRC Complaint →
                </a>
              </div>
            )}

            {/* Restart */}
            <div className="flex gap-3">
              <button onClick={reset} className="btn-secondary flex-1 text-sm">
                Scan another payslip
              </button>
              <button
                onClick={() => {/* TODO: save to history */}}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <Download size={14} />
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
