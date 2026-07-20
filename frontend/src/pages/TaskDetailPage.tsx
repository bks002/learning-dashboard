import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ErrorMessage, LoadingSpinner, SuccessMessage } from '../components'
import { ApiError, getTask, getTaskActivity, updateTaskStatus } from '../services/api'
import type { ActivityLogEntry, ProjectTask, TaskStatus } from '../types'
import './taskDetail.css'

interface LocationState {
  successMessage?: string
}

function formatStatus(status: TaskStatus): string {
  switch (status) {
    case 'InProgress':
      return 'In Progress'
    default:
      return status
  }
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString()
}

function formatActivityAction(action: ActivityLogEntry['action']): string {
  switch (action) {
    case 'StatusChanged':
      return 'Status changed'
    case 'Created':
      return 'Created'
    default:
      return 'Updated'
  }
}

function statusClass(status: TaskStatus): string {
  switch (status) {
    case 'InProgress':
      return 'task-detail-status--in-progress'
    case 'Completed':
      return 'task-detail-status--completed'
    default:
      return 'task-detail-status--planned'
  }
}

export function TaskDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const taskId = Number(id)

  const [task, setTask] = useState<ProjectTask | null>(null)
  const [activity, setActivity] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activityError, setActivityError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as LocationState | null)?.successMessage ?? null,
  )
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const loadTask = useCallback(async () => {
    if (!id || Number.isNaN(taskId)) {
      setLoading(false)
      setTask(null)
      setError('Invalid task id.')
      setNotFound(false)
      return
    }

    setLoading(true)
    setError(null)
    setNotFound(false)

    try {
      const data = await getTask(taskId)
      setTask(data)
    } catch (err) {
      setTask(null)

      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true)
        setError('Task not found.')
      } else {
        const message =
          err instanceof ApiError ? err.message : 'Failed to load task.'
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [id, taskId])

  const loadActivity = useCallback(async () => {
    if (!id || Number.isNaN(taskId)) {
      setActivityLoading(false)
      return
    }

    setActivityLoading(true)
    setActivityError(null)

    try {
      const entries = await getTaskActivity(taskId)
      setActivity(entries)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load activity log.'
      setActivity([])
      setActivityError(message)
    } finally {
      setActivityLoading(false)
    }
  }, [id, taskId])

  useEffect(() => {
    void loadTask()
    void loadActivity()
  }, [loadTask, loadActivity])

  const handleStatusUpdate = async (status: TaskStatus) => {
    if (!task) {
      return
    }

    setUpdatingStatus(true)
    setActionError(null)
    setSuccessMessage(null)

    try {
      const updated = await updateTaskStatus(task.id, status)
      setTask(updated)
      setSuccessMessage(`Task marked as ${formatStatus(status)}.`)
      await loadActivity()
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to update task status.'
      setActionError(message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (!id || Number.isNaN(taskId)) {
    return (
      <ErrorMessage title="Invalid task" message="The task id in the URL is not valid." />
    )
  }

  if (loading) {
    return <LoadingSpinner message="Loading task..." />
  }

  if (notFound) {
    return (
      <section className="task-detail-page">
        <ErrorMessage
          title="Task not found"
          message="This task may have been removed or the link is incorrect."
        />
        <p>
          <Link to="/tasks" className="back-link">
            Back to tasks
          </Link>
        </p>
      </section>
    )
  }

  if (error || !task) {
    return (
      <ErrorMessage
        title="Unable to load task"
        message={error ?? 'Failed to load task.'}
        onRetry={() => void loadTask()}
      />
    )
  }

  return (
    <section className="task-detail-page" aria-labelledby="task-detail-heading">
      <header className="page-header task-detail-page__header">
        <div>
          <p>
            <Link to="/tasks" className="back-link">
              ← Back to tasks
            </Link>
          </p>
          <h1 id="task-detail-heading">{task.title}</h1>
        </div>
      </header>

      <div className="task-detail-page__messages">
        {successMessage ? (
          <SuccessMessage
            message={successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        ) : null}

        {actionError ? (
          <ErrorMessage title="Status update failed" message={actionError} />
        ) : null}
      </div>

      <article className="task-detail-card">
        <dl className="task-detail-grid">
          <div className="task-detail-field">
            <dt>Status</dt>
            <dd>
              <span className={`task-detail-status ${statusClass(task.status)}`}>
                {formatStatus(task.status)}
              </span>
            </dd>
          </div>

          <div className="task-detail-field">
            <dt>Priority</dt>
            <dd>{task.priority}</dd>
          </div>

          <div className="task-detail-field">
            <dt>Owner</dt>
            <dd>{task.ownerName}</dd>
          </div>

          <div className="task-detail-field">
            <dt>Category</dt>
            <dd>{task.category ?? '—'}</dd>
          </div>

          <div className="task-detail-field">
            <dt>Due Date</dt>
            <dd>{formatDateTime(task.dueDate)}</dd>
          </div>

          <div className="task-detail-field">
            <dt>Created</dt>
            <dd>{formatDateTime(task.createdAt)}</dd>
          </div>

          <div className="task-detail-field">
            <dt>Last Updated</dt>
            <dd>{formatDateTime(task.updatedAt)}</dd>
          </div>
          <div className="task-detail-field task-detail-field--full">
            <dt>Description</dt>
            <dd className="task-detail-field__description">
              {task.description?.trim() ? task.description : '—'}
            </dd>
          </div>
        </dl>
      </article>

      <div className="task-detail-actions">
        <Link to={`/tasks/${task.id}/edit`} className="btn btn--secondary">
          Edit Task
        </Link>

        {task.status === 'Planned' ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={updatingStatus}
            onClick={() => void handleStatusUpdate('InProgress')}
          >
            Mark In Progress
          </button>
        ) : null}

        {task.status !== 'Completed' ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={updatingStatus}
            onClick={() => void handleStatusUpdate('Completed')}
          >
            Mark Completed
          </button>
        ) : null}
      </div>

      <section className="task-activity" aria-labelledby="task-activity-heading">
        <h2 id="task-activity-heading">Activity</h2>

        {activityLoading ? <LoadingSpinner message="Loading activity..." /> : null}

        {!activityLoading && activityError ? (
          <ErrorMessage
            title="Unable to load activity"
            message={activityError}
            onRetry={() => void loadActivity()}
          />
        ) : null}

        {!activityLoading && !activityError && activity.length === 0 ? (
          <p className="task-activity__empty">No activity recorded yet.</p>
        ) : null}

        {!activityLoading && !activityError && activity.length > 0 ? (
          <ol className="task-activity__list">
            {activity.map((entry) => (
              <li key={entry.id} className="task-activity__item">
                <div className="task-activity__meta">
                  <strong>{formatActivityAction(entry.action)}</strong>
                  <time dateTime={entry.createdAt}>
                    {formatDateTime(entry.createdAt)}
                  </time>
                </div>
                <p>{entry.message}</p>
                {entry.performedByUserName ? (
                  <p className="task-activity__actor">By {entry.performedByUserName}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </section>
  )
}
