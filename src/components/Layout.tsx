import BottomNav from './BottomNav'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  hideNav?: boolean
  headerRight?: React.ReactNode
}

export default function Layout({ children, title, showBack, hideNav, headerRight }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header title={title} showBack={showBack} rightElement={headerRight} />
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {children}
        </div>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
