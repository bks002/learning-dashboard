import { useCallback, useEffect, useState } from 'react'
import { DashboardCard } from '../components/DashboardCard'
import { ErrorMessage, LoadingSpinner } from '../components'
import { ApiError, getDashboardSummary } from '../services/api'
import type { DashboardSummary } from '../types'
import './dashboard.css'

export function DashboardPage() {
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

  return (
    <section className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your learning tasks and progress.</p>
      </header>

      <div className="dashboard-grid">
        <DashboardCard label="Total" value={summary.totalItems} />
        <DashboardCard label="Completed" value={summary.completedItems} />
        <DashboardCard
          label="In Progress"
          value={summary.inProgressItems}
          variant="accent"
        />
        <DashboardCard
          label="Overdue"
          value={summary.overdueItems}
          variant="warning"
        />
        <DashboardCard
          label="High Priority"
          value={summary.highPriorityItems}
          variant="accent"
        />
      </div>
    </section>
  )
}
