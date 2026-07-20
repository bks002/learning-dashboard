import { NavLink, Outlet } from 'react-router-dom'
import './AppLayout.css'

export function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-header__title">Learning Dashboard</h1>
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            end
            className={({ isActive }) =>
              `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
            }
          >
            New Task
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
