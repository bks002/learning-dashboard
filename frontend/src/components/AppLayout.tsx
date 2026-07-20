import { NavLink, Outlet } from 'react-router-dom'
import { Icon } from './Icon'
import { useAuth } from '../context/AuthContext'
import './AppLayout.css'

const NAV_ITEMS = [
  { to: '/', end: true, label: 'Dashboard', icon: 'dashboard' as const },
  { to: '/tasks', end: true, label: 'Tasks', icon: 'tasks' as const },
  { to: '/tasks/new', end: false, label: 'New Task', icon: 'plus' as const },
]

export function AppLayout() {
  const { session, logout } = useAuth()

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-brand">
            <span className="app-brand__mark" aria-hidden="true">
              <Icon name="book" />
            </span>
            <div>
              <p className="app-brand__eyebrow">Learning</p>
              <h1 className="app-brand__title">Dashboard</h1>
            </div>
          </div>

          {session ? (
            <div className="app-header__user" aria-label="Signed in user">
              <div className="app-header__avatar" aria-hidden="true">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div className="app-header__user-meta">
                <span className="app-header__user-name">{session.name}</span>
                <span className="app-header__user-role">{session.role}</span>
              </div>
              <button type="button" className="btn btn--ghost btn--small" onClick={logout}>
                Sign out
              </button>
            </div>
          ) : null}
        </div>

        <nav className="app-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              <Icon name={item.icon} className="app-nav__icon" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
