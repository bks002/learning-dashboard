import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ErrorMessage } from '../components'
import { Icon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/api'
import './login.css'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as LocationState | null)?.from ?? '/'

  const [email, setEmail] = useState('alice@example.com')
  const [password, setPassword] = useState('Password123!')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Login failed. Check your credentials and try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-shell">
      <aside className="login-shell__hero" aria-hidden="true">
        <div className="login-shell__hero-content">
          <span className="login-shell__logo">
            <Icon name="book" />
          </span>
          <h2>Track learning goals with clarity</h2>
          <p>
            Manage tasks, monitor progress, and stay on top of priorities — all in one
            place.
          </p>
        </div>
      </aside>

      <section className="login-page" aria-labelledby="login-heading">
        <div className="login-card panel panel--elevated">
          <p className="page-eyebrow">Welcome back</p>
          <h1 id="login-heading">Sign in</h1>
          <p className="login-card__hint">
            Demo account: <code>alice@example.com</code> / <code>Password123!</code>
          </p>

          {error ? <ErrorMessage title="Login failed" message={error} /> : null}

          <form className="login-form" onSubmit={(event) => void handleSubmit(event)}>
            <label htmlFor="login-email">
              Email
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label htmlFor="login-password">
              Password
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn btn--primary login-form__submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
