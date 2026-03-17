import { CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { PayslipFlag } from '@/types'

interface FlagBadgeProps {
  flag: PayslipFlag
}

const icons = {
  ok: CheckCircle,
  warning: AlertTriangle,
  violation: XCircle,
}

const styles = {
  ok: 'flag-ok',
  warning: 'flag-warning',
  violation: 'flag-violation',
}

const labels = {
  ok: 'OK',
  warning: 'Review',
  violation: 'Violation',
}

export default function FlagBadge({ flag }: FlagBadgeProps) {
  const [expanded, setExpanded] = useState(flag.type === 'violation')
  const Icon = icons[flag.type]

  return (
    <div className={`rounded-xl border p-3 ${styles[flag.type]}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-2 text-left"
      >
        <Icon size={16} className="mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
              {labels[flag.type]} · {flag.category.replace(/_/g, ' ')}
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <p className="text-sm font-medium mt-0.5">{flag.message}</p>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 ml-6 space-y-1.5 text-sm opacity-90">
          <p>{flag.detail}</p>
          {flag.legalBasis && (
            <p className="text-xs opacity-70 italic">📋 {flag.legalBasis}</p>
          )}
          {flag.action && (
            <p className="text-xs font-medium mt-1">
              ➜ {flag.action}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
