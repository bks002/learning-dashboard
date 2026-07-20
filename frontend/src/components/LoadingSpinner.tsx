import './uiStates.css'

interface LoadingSpinnerProps {
  message?: string
  size?: 'default' | 'small'
  inline?: boolean
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'default',
  inline = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`ui-state${inline ? ' ui-state--inline' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={`loading-spinner${size === 'small' ? ' loading-spinner--small' : ''}`}
        aria-hidden="true"
      />
      {message ? <p className="loading-spinner__message">{message}</p> : null}
    </div>
  )
}
