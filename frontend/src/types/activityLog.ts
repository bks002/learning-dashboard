export interface ActivityLogEntry {
  id: number
  taskId: number
  action: ActivityAction
  message: string
  performedByUserId: number | null
  performedByUserName: string | null
  createdAt: string
}

export type ActivityAction = 'Created' | 'Updated' | 'StatusChanged'
