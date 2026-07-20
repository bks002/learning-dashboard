export class ApiError extends Error {
  readonly status: number
  readonly validationErrors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    validationErrors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function normalizeValidationErrors(
  errors: Record<string, string[]>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      messages,
    ]),
  )
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: unknown

  try {
    body = await response.json()
  } catch {
    return new ApiError(response.statusText || 'Request failed', response.status)
  }

  if (!isRecord(body)) {
    return new ApiError(response.statusText || 'Request failed', response.status)
  }

  if (isRecord(body.errors)) {
    const validationErrors = Object.fromEntries(
      Object.entries(body.errors).map(([key, value]) => [
        key,
        Array.isArray(value)
          ? value.filter((item): item is string => typeof item === 'string')
          : [],
      ]),
    )

    return new ApiError(
      typeof body.title === 'string' ? body.title : 'Validation failed',
      response.status,
      normalizeValidationErrors(validationErrors),
    )
  }

  if (typeof body.error === 'string') {
    return new ApiError(body.error, response.status)
  }

  if (typeof body.title === 'string') {
    return new ApiError(body.title, response.status)
  }

  return new ApiError(response.statusText || 'Request failed', response.status)
}
