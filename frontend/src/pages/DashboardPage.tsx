import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { DashboardCard } from '../components/DashboardCard'
import { Icon } from '../components/Icon'
import { ErrorMessage, LoadingSpinner } from '../components'
import { useAuth } from '../context/AuthContext'
import { ApiError, getDashboardSummary } from '../services/api'
import type { DashboardSummary } from '../types'
import './dashboard.css'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const { session } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getDashboardSummary()
      setSummary(data)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load dashboard summary.'
      setSummary(null)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadSummary()
  }, [loadSummary])

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Unable to load dashboard"
        message={error}
        onRetry={() => void loadSummary()}
      />
    )
  }

  if (!summary) {
    return null
  }

  const completionRate =
    summary.totalItems > 0
      ? Math.round((summary.completedItems / summary.totalItems) * 100)
      : 0

  return (
    <section className="dashboard-page">
      <header className="page-header dashboard-page__header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>
            {getGreeting()}
            {session ? `, ${session.name.split(' ')[0]}` : ''}
          </h1>
          <p>
            {summary.totalItems} learning tasks tracked
            {summary.totalItems > 0 ? ` · ${completionRate}% complete` : ''}.
          </p>
        </div>
        <Link to="/tasks/new" className="btn btn--primary">
          <Icon name="plus" className="btn__icon" />
          New Task
        </Link>
      </header>

      <div className="dashboard-grid">
        <DashboardCard label="Total" value={summary.totalItems} icon="total" />
        <DashboardCard
          label="Completed"
          value={summary.completedItems}
          variant="success"
          icon="completed"
        />
        <DashboardCard
          label="In Progress"
          value={summary.inProgressItems}
          variant="accent"
          icon="progress"
        />
        <DashboardCard
          label="Overdue"
          value={summary.overdueItems}
          variant="warning"
          icon="overdue"
        />
        <DashboardCard
          label="High Priority"
          value={summary.highPriorityItems}
          variant="info"
          icon="priority"
        />
      </div>

      <section className="dashboard-quick-actions panel panel--elevated" aria-label="Quick actions">
        <h2 className="dashboard-quick-actions__title">Quick actions</h2>
        <div className="dashboard-quick-actions__grid">
          <Link to="/tasks" className="dashboard-quick-action">
            <span className="dashboard-quick-action__icon" aria-hidden="true">
              <Icon name="tasks" />
            </span>
            <span>
              <span className="dashboard-quick-action__label">Browse tasks</span>
              <span className="dashboard-quick-action__hint">Filter, search, and paginate</span>
            </span>
          </Link>
          <Link to="/tasks/new" className="dashboard-quick-action">
            <span className="dashboard-quick-action__icon" aria-hidden="true">
              <Icon name="plus" />
            </span>
            <span>
              <span className="dashboard-quick-action__label">Create task</span>
              <span className="dashboard-quick-action__hint">Add a new learning goal</span>
            </span>
          </Link>
        </div>
      </section>
    </section>
  )
}
