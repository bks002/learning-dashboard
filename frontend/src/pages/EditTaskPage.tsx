import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorMessage, LoadingSpinner } from '../components'
import { TaskForm } from '../components/TaskForm'
import type { TaskFormValues } from '../types'
import { ApiError, getTask, getUsers, updateTask } from '../services/api'
import type { ProjectTask, UpdateProjectTaskRequest, User } from '../types'
import '../components/taskForm.css'

function toFormValues(task: ProjectTask): TaskFormValues {
  return {
    title: task.title,
    description: task.description ?? '',
    category: task.category ?? '',
    priority: task.priority,
    status: task.status,
    ownerId: String(task.ownerId),
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  }
}

export function EditTaskPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const taskId = Number(id)

  const [task, setTask] = useState<ProjectTask | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  const clearServerError = (field: keyof TaskFormValues) => {
    setServerErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const loadPageData = useCallback(async () => {
    if (!id || Number.isNaN(taskId)) {
      setLoading(false)
      setTask(null)
      setUsers([])
      setLoadError('Invalid task id.')
      setNotFound(false)
      return
    }

    setLoading(true)
    setLoadError(null)
    setNotFound(false)

    try {
      const [taskData, usersData] = await Promise.all([
        getTask(taskId),
        getUsers(),
      ])
      setTask(taskData)
      setUsers(usersData)
    } catch (err) {
      setTask(null)
      setUsers([])

      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true)
        setLoadError('Task not found.')
      } else {
        const message =
          err instanceof ApiError ? err.message : 'Failed to load task.'
        setLoadError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [id, taskId])

  useEffect(() => {
    void loadPageData()
  }, [loadPageData])

  const handleSubmit = async (values: UpdateProjectTaskRequest) => {
    if (!task) {
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setServerErrors({})

    try {
      await updateTask(task.id, values)
      navigate(`/tasks/${task.id}`, {
        state: { successMessage: 'Task updated successfully.' },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
        setServerErrors(err.validationErrors ?? {})
      } else {
        setSubmitError('Failed to update task.')
      }
    } finally {
      setSubmitting(false)
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
      <section>
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

  if (loadError || !task) {
    return (
      <ErrorMessage
        title="Unable to load task"
        message={loadError ?? 'Failed to load task.'}
        onRetry={() => void loadPageData()}
      />
    )
  }

  return (
    <section>
      <header className="page-header">
        <p>
          <Link to={`/tasks/${task.id}`} className="back-link">
            ← Back to task
          </Link>
        </p>
        <h1>Edit Task</h1>
        <p>Update the details for &ldquo;{task.title}&rdquo;.</p>
      </header>

      {submitError ? (
        <ErrorMessage
          title="Unable to update task"
          message={submitError}
          validationErrors={serverErrors}
        />
      ) : null}

      <TaskForm
        key={task.id}
        users={users}
        initialValues={toFormValues(task)}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverErrors={serverErrors}
        onClearServerError={clearServerError}
        submitLabel="Save Changes"
        cancelTo={`/tasks/${task.id}`}
      />
    </section>
  )
}
