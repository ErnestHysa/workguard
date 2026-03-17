import { FileText, ClipboardList, Clock, HelpCircle, AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '@/components/Layout'

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

const statCards = [
  { icon: AlertTriangle, label: 'Payslips checked', value: '0', color: 'text-amber-400' },
  { icon: CheckCircle, label: 'All clear', value: '0', color: 'text-emerald-400' },
  { icon: Shield, label: 'Potential violations', value: '0', color: 'text-red-400' },
]

export default function Home() {
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-3 text-center">
            <Icon size={18} className={`${color} mx-auto mb-1`} />
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 leading-tight">{label}</div>
          </div>
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

      {/* Know Your Rights Highlight */}
      <div className="card p-4 bg-gradient-to-br from-brand-900/50 to-slate-800/50 border-brand-700/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-white text-sm">Did you know?</h3>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              59% of hourly workers in Ireland experience wage theft. The most common forms are
              unpaid overtime, illegal deductions, and being paid below minimum wage.
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

      {/* Recent Activity placeholder */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Recent Activity
        </h2>
        <div className="card p-6 text-center">
          <p className="text-slate-500 text-sm">No activity yet</p>
          <p className="text-slate-600 text-xs mt-1">
            Scan a payslip or log your first shift to get started
          </p>
        </div>
      </div>
    </Layout>
  )
}
