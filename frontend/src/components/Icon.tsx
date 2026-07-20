import type { ReactNode } from 'react'

export type IconName =
  | 'dashboard'
  | 'tasks'
  | 'plus'
  | 'total'
  | 'completed'
  | 'progress'
  | 'overdue'
  | 'priority'
  | 'book'

interface IconProps {
  name: IconName
  className?: string
}

const paths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  tasks: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="5" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  total: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </>
  ),
  completed: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  progress: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  overdue: (
    <>
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
      <path d="M10.3 4.5 2.5 18h19L13.7 4.5a2 2 0 0 0-3.4 0z" />
    </>
  ),
  priority: (
    <>
      <path d="M5 20V6l7-3 7 3v14" />
      <path d="M9 10h6M9 14h6" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
      <path d="M5 20h12" />
    </>
  ),
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
