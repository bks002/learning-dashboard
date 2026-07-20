import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskForm } from './TaskForm'
import type { User } from '../types'

const users: User[] = [
  {
    id: 1,
    name: 'Alice Admin',
    email: 'alice@example.com',
    role: 'Admin',
  },
]

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation error when title is empty on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <MemoryRouter>
        <TaskForm users={users} onSubmit={onSubmit} submitting={false} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Save Task' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid task data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <MemoryRouter>
        <TaskForm users={users} onSubmit={onSubmit} submitting={false} />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Title *'), 'Learn React testing')
    await user.selectOptions(screen.getByLabelText('Owner *'), '1')
    await user.click(screen.getByRole('button', { name: 'Save Task' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Learn React testing',
        description: null,
        category: null,
        priority: 'Medium',
        status: 'Planned',
        ownerId: 1,
        dueDate: null,
      })
    })
  })
})
