import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, ErrorMessage, LoadingSpinner } from '../components'
import { ApiError, getTasks } from '../services/api'
import type { ProjectTask, TaskPriority, TaskStatus } from '../types'
import './taskList.css'

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'Planned', label: 'Planned' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

const PRIORITY_OPTIONS: { value: TaskPriority | ''; label: string }[] = [
  { value: '', label: 'All priorities' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

const SORT_OPTIONS = [
  { value: 'updatedAt:desc', label: 'Recently updated' },
  { value: 'title:asc', label: 'Title (A–Z)' },
  { value: 'dueDate:asc', label: 'Due date (earliest)' },
  { value: 'priority:desc', label: 'Priority (high first)' },
  { value: 'status:asc', label: 'Status' },
] as const

const PAGE_SIZE = 10

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

function priorityBadgeClass(priority: TaskPriority): string {
  switch (priority) {
    case 'High':
      return 'task-badge--priority-high'
    case 'Medium':
      return 'task-badge--priority-medium'
    default:
      return 'task-badge--priority-low'
  }
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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortValue, setSortValue] = useState<string>(SORT_OPTIONS[0].value)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 300)

    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, priorityFilter, debouncedSearch, sortValue])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [sortBy, sortDir] = sortValue.split(':') as [string, 'asc' | 'desc']

    try {
      const data = await getTasks({
        page,
        pageSize: PAGE_SIZE,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        search: debouncedSearch || undefined,
        sortBy,
        sortDir,
      })
      setTasks(data.items)
      setTotalPages(data.totalPages)
      setTotalCount(data.totalCount)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load tasks.'
      setTasks([])
      setTotalPages(1)
      setTotalCount(0)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, priorityFilter, debouncedSearch, sortValue])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const hasFilters =
    statusFilter !== '' || priorityFilter !== '' || debouncedSearch !== ''

  return (
    <section className="task-list-page" aria-labelledby="task-list-heading">
      <header className="page-header task-list-page__header">
        <div>
          <h1 id="task-list-heading">Tasks</h1>
          <p>Browse, filter, and search your learning tasks.</p>
        </div>
        <Link to="/tasks/new" className="btn btn--primary">
          New Task
        </Link>
      </header>

      <div className="task-list-filters" role="search" aria-label="Task filters">
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
          Priority
          <select
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value as TaskPriority | '')
            }
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort by
          <select
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            aria-label="Sort tasks"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
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
        <>
          <p className="task-list-summary" aria-live="polite">
            Showing page {page} of {totalPages} ({totalCount} tasks)
          </p>

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
                  <td>
                    <span className={`task-badge ${priorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                    <td>{task.ownerName}</td>
                    <td>{formatDate(task.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav className="task-pagination" aria-label="Task list pagination">
            <button
              type="button"
              className="btn btn--secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span className="task-pagination__label">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn--secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </button>
          </nav>
        </>
      ) : null}
    </section>
  )
}
