import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorMessage, LoadingSpinner } from '../components'
import { ApiError, getTasks } from '../services/api'
import type { ProjectTask, TaskStatus } from '../types'
import './taskList.css'

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'Planned', label: 'Planned' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

function formatStatus(status: TaskStatus): string {
  switch (status) {
    case 'InProgress':
      return 'In Progress'
    default:
      return status
  }
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleDateString()
}

function statusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case 'InProgress':
      return 'task-badge--in-progress'
    case 'Completed':
      return 'task-badge--completed'
    default:
      return 'task-badge--planned'
  }
}

export function TaskListPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getTasks({
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
      })
      setTasks(data)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load tasks.'
      setTasks([])
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, debouncedSearch])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const hasFilters = statusFilter !== '' || debouncedSearch !== ''

  return (
    <section className="task-list-page">
      <header className="page-header task-list-page__header">
        <div>
          <h1>Tasks</h1>
          <p>Browse, filter, and search your learning tasks.</p>
        </div>
        <Link to="/tasks/new" className="btn btn--primary">
          New Task
        </Link>
      </header>

      <div className="task-list-filters">
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as TaskStatus | '')
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, description, category..."
            aria-label="Search tasks"
          />
        </label>
      </div>

      {loading ? <LoadingSpinner message="Loading tasks..." /> : null}

      {!loading && error ? (
        <ErrorMessage
          title="Unable to load tasks"
          message={error}
          onRetry={() => void loadTasks()}
        />
      ) : null}

      {!loading && !error && tasks.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No matching tasks' : 'No tasks yet'}
          message={
            hasFilters
              ? 'Try changing the status filter or search keyword.'
              : 'Create your first learning task to get started.'
          }
          action={
            hasFilters ? undefined : (
              <Link to="/tasks/new" className="btn btn--primary">
                Create Task
              </Link>
            )
          }
        />
      ) : null}

      {!loading && !error && tasks.length > 0 ? (
        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
                <th scope="col">Owner</th>
                <th scope="col">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <Link to={`/tasks/${task.id}`} className="task-table__link">
                      {task.title}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`task-badge ${statusBadgeClass(task.status)}`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td
                    className={
                      task.priority === 'High' ? 'task-badge--priority-high' : ''
                    }
                  >
                    {task.priority}
                  </td>
                  <td>{task.ownerName}</td>
                  <td>{formatDate(task.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
