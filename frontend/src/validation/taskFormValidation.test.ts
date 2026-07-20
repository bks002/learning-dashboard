import { describe, expect, it } from 'vitest'
import type { TaskFormValues } from '../types'
import { validateTaskForm } from './taskFormValidation'

const baseValues: TaskFormValues = {
  title: 'Valid title',
  description: '',
  category: '',
  priority: 'Medium',
  status: 'Planned',
  ownerId: '1',
  dueDate: '',
}

describe('validateTaskForm', () => {
  it('returns error when title is empty', () => {
    const errors = validateTaskForm({ ...baseValues, title: '   ' })
    expect(errors.title).toBe('Title is required.')
  })

  it('returns error when owner is missing', () => {
    const errors = validateTaskForm({ ...baseValues, ownerId: '' })
    expect(errors.ownerId).toBe('Owner is required.')
  })

  it('passes for valid values', () => {
    const errors = validateTaskForm(baseValues, [
      { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    ])
    expect(errors).toEqual({})
  })
})
