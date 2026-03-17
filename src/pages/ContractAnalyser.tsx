import { useState } from 'react'
import { ClipboardList, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import Layout from '@/components/Layout'
import UploadZone from '@/components/UploadZone'
import RiskBadge from '@/components/RiskBadge'
import LoadingSpinner from '@/components/LoadingSpinner'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import CountryToggle from '@/components/CountryToggle'
import { extractTextFromFile } from '@/lib/ocr'
import { analyzeContract } from '@/lib/claude'
import { useCountry } from '@/hooks/useCountry'
import type { ContractAnalysis, ContractClause } from '@/types'

type Step = 'upload' | 'extracting' | 'analysing' | 'result' | 'manual'

function ClauseCard({ clause }: { clause: ContractClause }) {
  const [expanded, setExpanded] = useState(clause.risk === 'high')

  const riskIcon = {
    low: <CheckCircle size={14} className="text-emerald-400 shrink-0" />,
    medium: <AlertTriangle size={14} className="text-amber-400 shrink-0" />,
    high: <XCircle size={14} className="text-red-400 shrink-0" />,
  }

  return (
    <div className="card p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 text-left"
      >
        <div className="mt-0.5">{riskIcon[clause.risk]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">{clause.title}</span>
            <div className="flex items-center gap-2">
              <RiskBadge risk={clause.risk} />
              {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
            </div>
          </div>
          {!expanded && (
            <p className="text-slate-400 text-xs mt-1 line-clamp-1">{clause.explanation}</p>
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 ml-5 space-y-2">
          {clause.excerpt && (
            <blockquote className="text-xs text-slate-400 italic border-l-2 border-slate-600 pl-3 py-1">
              "{clause.excerpt}"
            </blockquote>
          )}
          <p className="text-sm text-slate-300">{clause.explanation}</p>
          {clause.legalContext && (
            <p className="text-xs text-slate-500">
              📋 {clause.legalContext}
            </p>
          )}
          {clause.concern && (
            <p className="text-xs text-amber-300 font-medium">
              ⚠️ {clause.concern}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function ContractAnalyser() {
  const { country, setCountry } = useCountry()
  const [step, setStep] = useState<Step>('upload')
  const [manualText, setManualText] = useState('')
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'clauses' | 'questions'>('overview')

  const processText = async (text: string) => {
    setStep('analysing')
    setError('')
    try {
      const result = await analyzeContract(text, country)
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
      if (!text.trim()) throw new Error('Could not extract text. Try manual entry.')
      await processText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read file')
      setStep('upload')
    }
  }

  const reset = () => {
    setStep('upload')
    setAnalysis(null)
    setError('')
    setManualText('')
    setActiveTab('overview')
  }

  const highRiskClauses = analysis?.clauses.filter(c => c.risk === 'high') ?? []
  const mediumRiskClauses = analysis?.clauses.filter(c => c.risk === 'medium') ?? []
  const lowRiskClauses = analysis?.clauses.filter(c => c.risk === 'low') ?? []

  return (
    <Layout title="Contract Analyser" showBack>
      <div className="space-y-4">
        <DisclaimerBanner country={country} />

        {step === 'upload' && (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">Jurisdiction:</p>
              <CountryToggle country={country} onChange={setCountry} />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="card p-4 text-sm text-slate-300 space-y-1">
              <p className="font-semibold text-white">We'll check for:</p>
              {['Non-compete clauses', 'Illegal deductions', 'Garden leave', 'Right-to-search', 'Confidentiality scope', 'Secondary employment restrictions'].map(item => (
                <p key={item} className="text-slate-400">✓ {item}</p>
              ))}
            </div>
            <UploadZone
              onFile={handleFile}
              accept="application/pdf,image/*"
              label="Upload your contract"
            />
            <button onClick={() => setStep('manual')} className="text-brand-400 text-sm underline w-full text-center">
              Paste contract text instead
            </button>
          </>
        )}

        {step === 'manual' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">Jurisdiction:</p>
              <CountryToggle country={country} onChange={setCountry} />
            </div>
            <label className="block text-sm font-medium text-slate-300">
              Paste your employment contract text
            </label>
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="Paste the full contract text here..."
              rows={12}
              className="input-field resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setStep('upload')} className="btn-secondary flex-1">Back</button>
              <button onClick={() => processText(manualText)} disabled={!manualText.trim()} className="btn-primary flex-1">
                Analyse Contract
              </button>
            </div>
          </div>
        )}

        {step === 'extracting' && (
          <LoadingSpinner message="Reading your contract..." subMessage="Extracting document text" />
        )}
        {step === 'analysing' && (
          <LoadingSpinner
            message="Analysing contract..."
            subMessage={`Reviewing clauses under ${country === 'ireland' ? 'Irish' : 'UK'} employment law`}
          />
        )}

        {step === 'result' && analysis && (
          <div className="space-y-4">
            {/* Summary card */}
            <div className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-bold text-white">{analysis.overview.role || 'Employment Contract'}</h2>
                  {analysis.overview.employer && (
                    <p className="text-slate-400 text-sm">{analysis.overview.employer}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {analysis.redFlagCount > 0 && (
                    <span className="text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                      {analysis.redFlagCount} red flag{analysis.redFlagCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { count: highRiskClauses.length, label: 'High Risk', color: 'text-red-400' },
                  { count: mediumRiskClauses.length, label: 'Review', color: 'text-amber-400' },
                  { count: lowRiskClauses.length, label: 'OK', color: 'text-emerald-400' },
                ].map(({ count, label, color }) => (
                  <div key={label} className="card p-2 text-center">
                    <div className={`text-lg font-bold ${color}`}>{count}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* 3 things to know */}
              {analysis.threeThingsToKnow.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">3 things to know before signing</p>
                  {analysis.threeThingsToKnow.map((item, i) => (
                    <div key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-brand-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
              {(['overview', 'clauses', 'questions'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'questions' ? 'Ask Employer' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-3">
                <div className="card p-4 space-y-2 text-sm">
                  {[
                    ['Role', analysis.overview.role],
                    ['Employer', analysis.overview.employer],
                    ['Contract Type', analysis.overview.contractType],
                    ['Start Date', analysis.overview.startDate],
                    ['Salary', analysis.overview.salary],
                    ['Jurisdiction', analysis.overview.jurisdiction],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label as string} className="flex justify-between gap-2">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-white font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="card p-4">
                  <p className="text-sm font-semibold text-slate-300 mb-2">AI Summary</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            )}

            {activeTab === 'clauses' && (
              <div className="space-y-2">
                {highRiskClauses.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">High Risk</p>
                    {highRiskClauses.map((c, i) => <ClauseCard key={i} clause={c} />)}
                  </>
                )}
                {mediumRiskClauses.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mt-3">Review These</p>
                    {mediumRiskClauses.map((c, i) => <ClauseCard key={i} clause={c} />)}
                  </>
                )}
                {lowRiskClauses.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mt-3">Standard Clauses</p>
                    {lowRiskClauses.map((c, i) => <ClauseCard key={i} clause={c} />)}
                  </>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  Questions to ask your employer before signing:
                </p>
                {analysis.questionsToAsk.map((q, i) => (
                  <div key={i} className="card p-3 flex gap-2">
                    <MessageSquare size={14} className="text-brand-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">{q}</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={reset} className="btn-secondary w-full text-sm">
              Analyse another contract
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
