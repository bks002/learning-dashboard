import './uiStates.css'

interface SuccessMessageProps {
  title?: string
  message: string
  onDismiss?: () => void
}

export function SuccessMessage({
  title = 'Success',
  message,
  onDismiss,
}: SuccessMessageProps) {
  return (
    <div className="success-message" role="status" aria-live="polite">
      <p className="success-message__title">{title}</p>
      <p className="success-message__text">{message}</p>

      {onDismiss ? (
        <button
          type="button"
          className="success-message__dismiss"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      ) : null}
    </div>
  )
}
