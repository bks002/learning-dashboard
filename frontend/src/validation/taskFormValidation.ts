import type { TaskFormValues, User } from '../types'

export const TASK_FORM_LIMITS = {
  titleMaxLength: 200,
  descriptionMaxLength: 2000,
  categoryMaxLength: 100,
} as const

export function validateTaskForm(
  values: TaskFormValues,
  users: User[] = [],
): Record<string, string> {
  const errors: Record<string, string> = {}
  const title = values.title.trim()
  const description = values.description.trim()
  const category = values.category.trim()

  if (!title) {
    errors.title = 'Title is required.'
  } else if (title.length > TASK_FORM_LIMITS.titleMaxLength) {
    errors.title = `Title must be ${TASK_FORM_LIMITS.titleMaxLength} characters or fewer.`
  }

  if (description.length > TASK_FORM_LIMITS.descriptionMaxLength) {
    errors.description = `Description must be ${TASK_FORM_LIMITS.descriptionMaxLength} characters or fewer.`
  }

  if (category.length > TASK_FORM_LIMITS.categoryMaxLength) {
    errors.category = `Category must be ${TASK_FORM_LIMITS.categoryMaxLength} characters or fewer.`
  }

  if (!values.ownerId) {
    errors.ownerId = 'Owner is required.'
  } else {
    const ownerId = Number(values.ownerId)

    if (!Number.isInteger(ownerId) || ownerId < 1) {
      errors.ownerId = 'Owner must be a valid user.'
    } else if (users.length > 0 && !users.some((user) => user.id === ownerId)) {
      errors.ownerId = 'Selected owner is not available.'
    }
  }

  if (values.dueDate) {
    const parsed = new Date(`${values.dueDate}T00:00:00.000Z`)
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Due date is not valid.'
    }
  }

  return errors
}

export function validateTaskFormField(
  field: keyof TaskFormValues,
  values: TaskFormValues,
  users: User[] = [],
): Record<string, string> {
  const errors = validateTaskForm(values, users)
  const message = errors[field]

  return message ? { [field]: message } : {}
}
