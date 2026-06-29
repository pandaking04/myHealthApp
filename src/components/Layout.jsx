import { NavLink } from 'react-router-dom'
import { BottomNav } from './BottomNav'

const navItems = [
  { to: '/', label: 'หน้าหลัก' },
  { to: '/weight', label: 'น้ำหนัก' },
  { to: '/food', label: 'อาหาร' },
  { to: '/exercise', label: 'ออกกำลังกาย' },
]

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">MyHealth</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="md:ml-56 pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
