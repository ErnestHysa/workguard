import { useState } from 'react'
import { HelpCircle, Search, Send, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Layout from '@/components/Layout'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import LoadingSpinner from '@/components/LoadingSpinner'
import { askRightsQuestion } from '@/lib/claude'
import { IRELAND_FAQS } from '@/lib/faqs'
import type { RightsAnswer, FAQ } from '@/types'

const CATEGORIES = ['All', 'Pay', 'Hours', 'Leave', 'Tips', 'Contracts', 'Dismissal', 'Sick Pay', 'WRC']

function FAQCard({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <HelpCircle size={15} className="text-brand-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white pr-2">{faq.question}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-400 shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-slate-400 shrink-0 mt-0.5" />}
      </button>
      {open && (
        <div className="px-4 pb-4 ml-6">
          <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

function AnswerCard({ answer }: { answer: RightsAnswer }) {
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <p className="text-xs font-semibold text-brand-400 uppercase tracking-wide mb-2">AI Answer</p>
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{answer.answer}</p>
      </div>

      {answer.sources.length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Sources</p>
          <div className="space-y-1.5">
            {answer.sources.map((src, i) => (
              <div key={i} className="flex items-center gap-2">
                <BookOpen size={12} className="text-slate-500 shrink-0" />
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-brand-400 underline flex items-center gap-1">
                    {src.title} <ExternalLink size={10} />
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">{src.title}{src.act ? ` — ${src.act}` : ''}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {answer.relatedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Related:</span>
          {answer.relatedTopics.map(topic => (
            <span key={topic} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-slate-500 italic">{answer.disclaimer}</div>
    </div>
  )
}

export default function RightsHub() {
  const [activeTab, setActiveTab] = useState<'faq' | 'ask'>('faq')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<RightsAnswer | null>(null)
  const [error, setError] = useState('')

  const filteredFAQs = IRELAND_FAQS.filter(faq => {
    const matchCat = category === 'All' || faq.category === category
    const matchSearch = !search || faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    setError('')
    setAnswer(null)
    try {
      const result = await askRightsQuestion(question, 'ireland')
      setAnswer(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (q: string) => {
    setQuestion(q)
    setActiveTab('ask')
  }

  return (
    <Layout title="Know Your Rights" showBack>
      <div className="space-y-4">
        <DisclaimerBanner />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'faq' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'ask' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ask AI
          </button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search rights..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    category === cat
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredFAQs.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-slate-500 text-sm">No results for "{search}"</p>
                <button onClick={() => handleQuickQuestion(search)} className="text-brand-400 text-sm underline mt-2">
                  Ask the AI instead →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFAQs.map(faq => (
                  <FAQCard key={faq.id} faq={faq} />
                ))}
              </div>
            )}

            {/* Prompt to ask AI */}
            <div className="card p-4 bg-brand-900/20 border-brand-700/30 text-center">
              <p className="text-sm text-slate-300">Can't find what you need?</p>
              <button
                onClick={() => setActiveTab('ask')}
                className="text-brand-400 text-sm font-medium underline mt-1"
              >
                Ask our AI your specific question →
              </button>
            </div>
          </div>
        )}

        {/* Ask AI Tab */}
        {activeTab === 'ask' && (
          <div className="space-y-4">
            {/* Quick question suggestions */}
            {!answer && !loading && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Common questions</p>
                {[
                  'Can my employer keep my tips?',
                  'What is the minimum wage in Ireland?',
                  'Am I entitled to overtime pay?',
                  'How do I make a WRC complaint?',
                  'My employer is making illegal deductions — what can I do?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="w-full text-left card p-3 flex items-center gap-2 hover:bg-slate-700/50 transition-colors"
                  >
                    <HelpCircle size={13} className="text-brand-400 shrink-0" />
                    <span className="text-sm text-slate-300">{q}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Question input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Ask your employment rights question
              </label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="e.g. My employer charged me for a uniform without asking — is this legal?"
                rows={3}
                className="input-field resize-none text-sm"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAsk()
                  }
                }}
              />
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Getting answer...
                  </span>
                ) : (
                  <><Send size={14} /> Ask WorkGuard AI</>
                )}
              </button>
            </div>

            {loading && (
              <LoadingSpinner
                message="Researching your question..."
                subMessage="Checking Irish employment law"
              />
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            {answer && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <p className="text-xs text-slate-500">Your question:</p>
                  <p className="text-sm text-white font-medium mt-0.5">{answer.question}</p>
                </div>
                <AnswerCard answer={answer} />
                <button
                  onClick={() => { setAnswer(null); setQuestion('') }}
                  className="btn-ghost w-full text-sm"
                >
                  Ask another question
                </button>
              </div>
            )}

            {/* WRC Links */}
            <div className="card p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Useful Links</p>
              {[
                { label: 'Workplace Relations Commission', url: 'https://www.workplacerelations.ie' },
                { label: 'Citizens Information — Employment', url: 'https://www.citizensinformation.ie/en/employment/' },
                { label: 'Revenue — PAYE & Tax', url: 'https://www.revenue.ie/en/jobs-and-pensions/' },
              ].map(({ label, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 text-sm text-brand-400 hover:text-brand-300"
                >
                  <span>{label}</span>
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
