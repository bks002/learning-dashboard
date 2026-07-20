import type { TaskPriority, TaskStatus } from './enums'

export interface TaskFormValues {
  title: string
  description: string
  category: string
  priority: TaskPriority
  status: TaskStatus
  ownerId: string
  dueDate: string
}
