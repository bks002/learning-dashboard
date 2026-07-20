import type { TaskPriority, TaskStatus } from './enums'

export interface ProjectTask {
  id: number
  title: string
  description: string | null
  category: string | null
  priority: TaskPriority
  status: TaskStatus
  ownerId: number
  ownerName: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateProjectTaskRequest {
  title: string
  description?: string | null
  category?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  ownerId: number
  dueDate?: string | null
}

export interface UpdateProjectTaskRequest {
  title: string
  description?: string | null
  category?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  ownerId: number
  dueDate?: string | null
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus
}
