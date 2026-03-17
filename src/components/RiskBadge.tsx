import type { RiskLevel } from '@/types'

interface RiskBadgeProps {
  risk: RiskLevel
  size?: 'sm' | 'md'
}

const styles: Record<RiskLevel, string> = {
  low: 'risk-low',
  medium: 'risk-medium',
  high: 'risk-high',
}

const labels: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Review',
  high: 'High Risk',
}

const dots: Record<RiskLevel, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
}

export default function RiskBadge({ risk, size = 'sm' }: RiskBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${styles[risk]} ${size === 'md' ? 'px-3 py-1 text-sm' : ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[risk]}`} />
      {labels[risk]}
    </span>
  )
}
