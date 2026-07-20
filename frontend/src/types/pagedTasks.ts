import type { ProjectTask } from './projectTask'

export interface PagedTasks {
  items: ProjectTask[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
