import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, LoadingSpinner } from '../components'
import { TaskForm } from '../components/TaskForm'
import type { TaskFormValues } from '../types'
import { ApiError, createTask, getUsers } from '../services/api'
import type { CreateProjectTaskRequest, User } from '../types'
import '../components/taskForm.css'

export function CreateTaskPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
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

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true)
    setLoadError(null)

    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load users.'
      setUsers([])
      setLoadError(message)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  const handleSubmit = async (values: CreateProjectTaskRequest) => {
    setSubmitting(true)
    setSubmitError(null)
    setServerErrors({})

    try {
      const created = await createTask(values)
      navigate(`/tasks/${created.id}`, {
        state: { successMessage: 'Task created successfully.' },
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message)
        setServerErrors(err.validationErrors ?? {})
      } else {
        setSubmitError('Failed to create task.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingUsers) {
    return <LoadingSpinner message="Loading form..." />
  }

  if (loadError) {
    return (
      <ErrorMessage
        title="Unable to load form"
        message={loadError}
        onRetry={() => void loadUsers()}
      />
    )
  }

  return (
    <section>
      <header className="page-header">
        <h1>Create Task</h1>
        <p>Add a new learning task to your dashboard.</p>
      </header>

      {submitError ? (
        <ErrorMessage
          title="Unable to create task"
          message={submitError}
          validationErrors={serverErrors}
        />
      ) : null}

      <TaskForm
        users={users}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverErrors={serverErrors}
        onClearServerError={clearServerError}
        submitLabel="Create Task"
        cancelTo="/tasks"
      />
    </section>
  )
}
