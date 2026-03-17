import { Shield, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  rightElement?: React.ReactNode
}

export default function Header({ title, showBack, rightElement }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              aria-label="Back"
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Shield size={22} className="text-brand-400 shrink-0" />
              <span className="font-bold text-white text-lg">WorkGuard</span>
            </div>
          )}
          {title && (
            <h1 className="font-semibold text-white truncate">{title}</h1>
          )}
        </div>
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
    </header>
  )
}
