import { NavLink } from 'react-router-dom'
import { BottomNav } from './BottomNav'

const navItems = [
  { to: '/', label: 'หน้าหลัก', icon: '📊' },
  { to: '/weight', label: 'น้ำหนัก', icon: '⚖️' },
  { to: '/food', label: 'อาหาร', icon: '🍽️' },
  { to: '/exercise', label: 'ออกกำลังกาย', icon: '💪' },
]

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-60 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-800/80">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            MyHealth
          </h1>
          <p className="text-xs text-muted mt-1">Personal Health Tracker</p>
        </div>
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:ml-60 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}