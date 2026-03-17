import { useState, useEffect } from 'react'
import { FileText, ClipboardList, Clock, HelpCircle, AlertTriangle, TrendingUp, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'
import { useCountry } from '@/hooks/useCountry'

const quickActions = [
  {
    to: '/payslip',
    icon: FileText,
    label: 'Scan Payslip',
    description: 'Check you\'re being paid correctly',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    to: '/contract',
    icon: ClipboardList,
    label: 'Analyse Contract',
    description: 'Spot risky clauses before signing',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    to: '/shifts',
    icon: Clock,
    label: 'Log Shifts',
    description: 'Track hours, compare to payslip',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    to: '/rights',
    icon: HelpCircle,
    label: 'Know Your Rights',
    description: 'Ask any employment question',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
]

function formatHours(h: number): string {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs === 0) return `${mins}m`
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export default function Home() {
  const { country } = useCountry()
  const [shiftCount, setShiftCount] = useState(0)
  const [totalHours, setTotalHours] = useState(0)

  // Read real shift data from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('workguard_shifts')
      if (raw) {
        const shifts: Array<{ durationHours: number }> = JSON.parse(raw)
        setShiftCount(shifts.length)
        setTotalHours(shifts.reduce((sum, s) => sum + (s.durationHours || 0), 0))
      }
    } catch { /* ignore */ }
  }, [])

  const nmwRate = country === 'ireland' ? '€14.15/hr' : '£12.71/hr'
  const nmwLabel = country === 'ireland' ? 'Irish NMW 2026' : 'UK NLW 2026'

  const statCards = [
    {
      icon: Clock,
      label: 'Shifts logged',
      value: String(shiftCount),
      color: 'text-brand-400',
      to: '/shifts',
    },
    {
      icon: TrendingUp,
      label: 'Hours tracked',
      value: totalHours > 0 ? formatHours(totalHours) : '0h',
      color: 'text-emerald-400',
      to: '/shifts',
    },
    {
      icon: AlertTriangle,
      label: nmwLabel,
      value: nmwRate,
      color: 'text-amber-400',
      to: '/rights',
    },
  ]

  const didYouKnow = country === 'ireland'
    ? {
        stat: '59% of hourly workers in Ireland experience wage theft.',
        detail: 'The most common forms are unpaid overtime, illegal deductions, and being paid below the €14.15/hr minimum wage.',
      }
    : {
        stat: 'UK workers on zero-hours contracts lost an estimated £250M in unpaid wages in 2024.',
        detail: 'Common issues include unlawful deductions, being paid below the £12.71/hr National Living Wage, and unpaid sick pay.',
      }

  return (
    <Layout>
      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={26} className="text-brand-400" />
          <h1 className="text-2xl font-bold text-white">WorkGuard</h1>
        </div>
        <p className="text-slate-400 text-sm">
          The app employers don't want you to have.
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {statCards.map(({ icon: Icon, label, value, color, to }) => (
          <Link key={label} to={to} className="card p-3 text-center hover:bg-slate-700/50 transition-colors">
            <Icon size={18} className={`${color} mx-auto mb-1`} />
            <div className="text-lg font-bold text-white truncate">{value}</div>
            <div className="text-xs text-slate-500 leading-tight">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
        What would you like to do?
      </h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {quickActions.map(({ to, icon: Icon, label, description, color, bg, border }) => (
          <Link
            key={to}
            to={to}
            className={`card p-4 flex items-center gap-4 border ${border} hover:scale-[1.01] transition-transform active:scale-[0.99]`}
          >
            <div className={`p-3 rounded-xl ${bg} shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="font-semibold text-white">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Did You Know — country-aware */}
      <div className="card p-4 bg-gradient-to-br from-brand-900/50 to-slate-800/50 border-brand-700/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-white text-sm">Did you know?</h3>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              <span className="font-semibold text-white">{didYouKnow.stat}</span>{' '}
              {didYouKnow.detail}
            </p>
            <Link
              to="/rights"
              className="text-brand-400 text-xs font-medium mt-2 inline-block"
            >
              Learn your rights →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Recent Activity
        </h2>
        {shiftCount === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-slate-500 text-sm">No activity yet</p>
            <p className="text-slate-600 text-xs mt-1">
              Scan a payslip or log your first shift to get started
            </p>
          </div>
        ) : (
          <div className="card p-4">
            <Link to="/shifts" className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={14} className="text-brand-400" />
                <span>{shiftCount} shift{shiftCount !== 1 ? 's' : ''} logged — {formatHours(totalHours)} total</span>
              </div>
              <span className="text-brand-400 text-xs">View →</span>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
