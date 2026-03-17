import { useState } from 'react'
import { Shield, Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { signInWithMagicLink } from '@/lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const { error } = await signInWithMagicLink(email.trim())
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="p-4 rounded-3xl bg-brand-600/20 mb-4">
              <Shield size={44} className="text-brand-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">WorkGuard</h1>
            <p className="text-slate-400 text-center mt-2 text-sm leading-relaxed">
              The app employers don't want you to have.
              <br />
              Know your rights. Get paid fairly.
            </p>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 gap-2 mb-10">
            {[
              '✅ Scan payslips for wage theft',
              '✅ Check employment contracts',
              '✅ Log shifts and compare to pay',
              '✅ Know your rights in plain English',
            ].map(item => (
              <div key={item} className="text-sm text-slate-300 flex items-center gap-2">
                <span>{item}</span>
              </div>
            ))}
          </div>

          {sent ? (
            <div className="card p-6 text-center space-y-3">
              <div className="flex justify-center">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h2 className="font-bold text-white text-lg">Check your email</h2>
              <p className="text-slate-400 text-sm">
                We sent a sign-in link to <span className="text-white font-medium">{email}</span>.
                Click it to get started.
              </p>
              <p className="text-slate-500 text-xs">
                No password needed. Link expires in 1 hour.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-brand-400 text-sm underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field pl-10"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    Get started free <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 leading-relaxed">
                No password. No credit card. Sign in via email link.
                <br />
                Your data is encrypted and never sold.
              </p>
            </form>
          )}
        </div>
      </div>

      <footer className="p-4 text-center text-xs text-slate-600">
        © 2025 WorkGuard · Not legal advice · GDPR compliant
      </footer>
    </div>
  )
}
