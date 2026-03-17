import type { Country } from '@/hooks/useCountry'

interface CountryToggleProps {
  country: Country
  onChange: (c: Country) => void
}

export default function CountryToggle({ country, onChange }: CountryToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl p-1 self-end">
      <button
        onClick={() => onChange('ireland')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          country === 'ireland'
            ? 'bg-brand-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        🇮🇪 Ireland
      </button>
      <button
        onClick={() => onChange('uk')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          country === 'uk'
            ? 'bg-brand-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        🇬🇧 UK
      </button>
    </div>
  )
}
