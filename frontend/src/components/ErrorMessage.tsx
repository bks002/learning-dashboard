import './uiStates.css'

interface ErrorMessageProps {
  title?: string
  message: string
  validationErrors?: Record<string, string[]>
  onRetry?: () => void
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  validationErrors,
  onRetry,
}: ErrorMessageProps) {
  const fieldErrors = validationErrors
    ? Object.entries(validationErrors).flatMap(([field, messages]) =>
        messages.map((entry) => ({ field, message: entry })),
      )
    : []

  return (
    <div className="error-message" role="alert">
      <p className="error-message__title">{title}</p>
      <p className="error-message__text">{message}</p>

      {fieldErrors.length > 0 ? (
        <ul className="error-message__list">
          {fieldErrors.map((entry) => (
            <li key={`${entry.field}-${entry.message}`}>
              {entry.field ? `${entry.field}: ` : ''}
              {entry.message}
            </li>
          ))}
        </ul>
      ) : null}

      {onRetry ? (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}
