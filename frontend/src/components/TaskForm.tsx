import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  CreateProjectTaskRequest,
  TaskFormValues,
  TaskPriority,
  TaskStatus,
  User,
} from '../types'
import {
  TASK_FORM_LIMITS,
  validateTaskForm,
  validateTaskFormField,
} from '../validation'
import './taskForm.css'

interface TaskFormProps {
  users: User[]
  initialValues?: Partial<TaskFormValues>
  onSubmit: (values: CreateProjectTaskRequest) => Promise<void>
  submitting: boolean
  serverErrors?: Record<string, string[]>
  onClearServerError?: (field: keyof TaskFormValues) => void
  submitLabel?: string
  cancelTo?: string
}

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'Planned', label: 'Planned' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
]

const DEFAULT_VALUES: TaskFormValues = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  status: 'Planned',
  ownerId: '',
  dueDate: '',
}

const VALIDATED_FIELDS: (keyof TaskFormValues)[] = [
  'title',
  'description',
  'category',
  'ownerId',
  'dueDate',
]

function toRequest(values: TaskFormValues): CreateProjectTaskRequest {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    category: values.category.trim() || null,
    priority: values.priority,
    status: values.status,
    ownerId: Number(values.ownerId),
    dueDate: values.dueDate ? `${values.dueDate}T00:00:00.000Z` : null,
  }
}

function fieldError(
  field: keyof TaskFormValues,
  clientErrors: Record<string, string>,
  serverErrors?: Record<string, string[]>,
): string | undefined {
  if (clientErrors[field]) {
    return clientErrors[field]
  }

  const messages = serverErrors?.[field]
  return messages?.[0]
}

function hasVisibleErrors(
  clientErrors: Record<string, string>,
  serverErrors?: Record<string, string[]>,
): boolean {
  return (
    Object.keys(clientErrors).length > 0 ||
    Object.keys(serverErrors ?? {}).length > 0
  )
}

export function TaskForm({
  users,
  initialValues,
  onSubmit,
  submitting,
  serverErrors,
  onClearServerError,
  submitLabel = 'Save Task',
  cancelTo = '/tasks',
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  })
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<
    Partial<Record<keyof TaskFormValues, boolean>>
  >({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const updateField = <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    onClearServerError?.(field)

    setClientErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleBlur = (field: keyof TaskFormValues) => {
    setTouched((current) => ({ ...current, [field]: true }))

    const fieldErrors = validateTaskFormField(field, values, users)
    setClientErrors((current) => {
      const next = { ...current }

      if (fieldErrors[field]) {
        next[field] = fieldErrors[field]
      } else {
        delete next[field]
      }

      return next
    })
  }

  const shouldShowError = (field: keyof TaskFormValues) =>
    submitAttempted || touched[field]

  const getFieldError = (field: keyof TaskFormValues) => {
    if (!shouldShowError(field)) {
      return undefined
    }

    return fieldError(field, clientErrors, serverErrors)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)
    setTouched(
      Object.fromEntries(
        VALIDATED_FIELDS.map((field) => [field, true]),
      ) as Partial<Record<keyof TaskFormValues, boolean>>,
    )

    const validationErrors = validateTaskForm(values, users)
    setClientErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    await onSubmit(toRequest(values))
  }

  const renderFieldError = (name: keyof TaskFormValues) => {
    const message = getFieldError(name)
    return message ? (
      <p className="task-form__error" id={`${name}-error`}>
        {message}
      </p>
    ) : null
  }

  const fieldHasError = (name: keyof TaskFormValues) => Boolean(getFieldError(name))

  return (
    <form
      className="task-form"
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      {submitAttempted && hasVisibleErrors(clientErrors, serverErrors) ? (
        <div className="task-form__summary" role="alert">
          Please fix the highlighted errors before saving.
        </div>
      ) : null}

      <div
        className={`task-form__field${fieldHasError('title') ? ' task-form__field--error' : ''}`}
      >
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={(event) => updateField('title', event.target.value)}
          onBlur={() => handleBlur('title')}
          maxLength={TASK_FORM_LIMITS.titleMaxLength}
          aria-invalid={fieldHasError('title')}
          aria-describedby={fieldHasError('title') ? 'title-error' : undefined}
        />
        {renderFieldError('title')}
      </div>

      <div
        className={`task-form__field${fieldHasError('description') ? ' task-form__field--error' : ''}`}
      >
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={(event) => updateField('description', event.target.value)}
          onBlur={() => handleBlur('description')}
          maxLength={TASK_FORM_LIMITS.descriptionMaxLength}
          aria-invalid={fieldHasError('description')}
          aria-describedby={
            fieldHasError('description') ? 'description-error' : undefined
          }
        />
        {renderFieldError('description')}
      </div>

      <div
        className={`task-form__field${fieldHasError('category') ? ' task-form__field--error' : ''}`}
      >
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          type="text"
          value={values.category}
          onChange={(event) => updateField('category', event.target.value)}
          onBlur={() => handleBlur('category')}
          maxLength={TASK_FORM_LIMITS.categoryMaxLength}
          aria-invalid={fieldHasError('category')}
          aria-describedby={
            fieldHasError('category') ? 'category-error' : undefined
          }
        />
        {renderFieldError('category')}
      </div>

      <div className="task-form__field">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={values.priority}
          onChange={(event) =>
            updateField('priority', event.target.value as TaskPriority)
          }
        >
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="task-form__field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={(event) =>
            updateField('status', event.target.value as TaskStatus)
          }
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`task-form__field${fieldHasError('ownerId') ? ' task-form__field--error' : ''}`}
      >
        <label htmlFor="ownerId">Owner *</label>
        <select
          id="ownerId"
          name="ownerId"
          value={values.ownerId}
          onChange={(event) => updateField('ownerId', event.target.value)}
          onBlur={() => handleBlur('ownerId')}
          aria-invalid={fieldHasError('ownerId')}
          aria-describedby={
            fieldHasError('ownerId') ? 'ownerId-error' : undefined
          }
        >
          <option value="">Select an owner</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {renderFieldError('ownerId')}
      </div>

      <div
        className={`task-form__field${fieldHasError('dueDate') ? ' task-form__field--error' : ''}`}
      >
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={values.dueDate}
          onChange={(event) => updateField('dueDate', event.target.value)}
          onBlur={() => handleBlur('dueDate')}
          aria-invalid={fieldHasError('dueDate')}
          aria-describedby={
            fieldHasError('dueDate') ? 'dueDate-error' : undefined
          }
        />
        {renderFieldError('dueDate')}
      </div>

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <Link to={cancelTo} className="btn btn--secondary">
          Cancel
        </Link>
      </div>
    </form>
  )
}
