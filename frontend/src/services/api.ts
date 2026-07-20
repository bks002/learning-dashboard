import type {
  ActivityLogEntry,
  AuthSession,
  CreateProjectTaskRequest,
  DashboardSummary,
  LoginRequest,
  LoginResponse,
  PagedTasks,
  ProjectTask,
  TaskPriority,
  TaskStatus,
  UpdateProjectTaskRequest,
  User,
} from '../types'
import { ApiError, parseApiError } from './apiError'
import { getAuthToken } from './authStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
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

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/dashboard/summary')
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>('/users')
}

export async function getTasks(options?: {
  page?: number
  pageSize?: number
  status?: TaskStatus
  search?: string
  priority?: TaskPriority
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}): Promise<PagedTasks> {
  const query = buildQueryString({
    page: options?.page,
    pageSize: options?.pageSize,
    status: options?.status,
    search: options?.search,
    priority: options?.priority,
    sortBy: options?.sortBy,
    sortDir: options?.sortDir,
  })

  return request<PagedTasks>(`/tasks${query}`)
}

export async function getTask(id: number): Promise<ProjectTask> {
  return request<ProjectTask>(`/tasks/${id}`)
}

export async function getTaskActivity(id: number): Promise<ActivityLogEntry[]> {
  return request<ActivityLogEntry[]>(`/tasks/${id}/activity`)
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

export type { AuthSession }
export { ApiError }
