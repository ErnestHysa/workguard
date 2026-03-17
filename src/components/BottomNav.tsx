import { NavLink } from 'react-router-dom'
import { Home, FileText, ClipboardList, Clock, HelpCircle } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/payslip', label: 'Payslip', icon: FileText },
  { to: '/contract', label: 'Contract', icon: ClipboardList },
  { to: '/shifts', label: 'Shifts', icon: Clock },
  { to: '/rights', label: 'Rights', icon: HelpCircle },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/60 safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 pb-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[52px] ${
                isActive
                  ? 'text-brand-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
