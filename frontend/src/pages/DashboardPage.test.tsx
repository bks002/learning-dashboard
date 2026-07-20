import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DashboardPage } from './DashboardPage'
import * as api from '../services/api'

vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/api')>()
  return {
    ...actual,
    getDashboardSummary: vi.fn(),
  }
})

const mockSummary = {
  totalItems: 5,
  completedItems: 2,
  inProgressItems: 1,
  overdueItems: 1,
  highPriorityItems: 3,
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(api.getDashboardSummary).mockResolvedValue(mockSummary)
  })

  it('renders dashboard counts from mocked API', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText('Total: 5')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Completed: 2')).toBeInTheDocument()
    expect(screen.getByLabelText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Overdue: 1')).toBeInTheDocument()
    expect(screen.getByLabelText('High Priority: 3')).toBeInTheDocument()
    expect(api.getDashboardSummary).toHaveBeenCalledTimes(1)
  })

  it('shows error state when API fails', async () => {
    vi.mocked(api.getDashboardSummary).mockRejectedValue(
      new api.ApiError('Network error', 500),
    )

    render(<DashboardPage />)

    expect(
      await screen.findByText('Unable to load dashboard'),
    ).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})
