import type {
  CreateProjectTaskRequest,
  DashboardSummary,
  ProjectTask,
  TaskStatus,
  UpdateProjectTaskRequest,
  User,
} from '../types'
import { ApiError, parseApiError } from './apiError'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

function buildQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value)
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary')
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>('/users')
}

export async function getTasks(options?: {
  status?: TaskStatus
  search?: string
}): Promise<ProjectTask[]> {
  const query = buildQueryString({
    status: options?.status,
    search: options?.search,
  })

  return request<ProjectTask[]>(`/tasks${query}`)
}

export async function getTask(id: number): Promise<ProjectTask> {
  return request<ProjectTask>(`/tasks/${id}`)
}

export async function createTask(
  data: CreateProjectTaskRequest,
): Promise<ProjectTask> {
  return request<ProjectTask>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTask(
  id: number,
  data: UpdateProjectTaskRequest,
): Promise<ProjectTask> {
  return request<ProjectTask>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus,
): Promise<ProjectTask> {
  return request<ProjectTask>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export { ApiError }
