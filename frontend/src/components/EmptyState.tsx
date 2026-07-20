import type { ReactNode } from 'react'
import './uiStates.css'

interface EmptyStateProps {
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="ui-state empty-state" role="status">
      <h2 className="empty-state__title">{title}</h2>
      {message ? <p className="empty-state__message">{message}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}
