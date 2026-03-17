import { Info } from 'lucide-react'
import type { Country } from '@/hooks/useCountry'

interface DisclaimerBannerProps {
  country?: Country
}

export default function DisclaimerBanner({ country = 'ireland' }: DisclaimerBannerProps) {
  const isUK = country === 'uk'

  return (
    <div className="flex gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
      <Info size={14} className="shrink-0 mt-0.5 text-brand-400" />
      <span>
        WorkGuard provides general information only, not legal advice. For specific situations, contact{' '}
        {isUK ? (
          <>
            <a
              href="https://www.acas.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 underline"
            >
              ACAS
            </a>
            , your union, or an employment solicitor.
          </>
        ) : (
          <>
            the{' '}
            <a
              href="https://www.workplacerelations.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 underline"
            >
              WRC
            </a>
            , your union, or a solicitor.
          </>
        )}
      </span>
    </div>
  )
}
