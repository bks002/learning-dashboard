# Prompt: React page with required UI states

Use when building a data-fetching page for the learning dashboard frontend.

## Context to provide

- API function from `services/api.ts` (typed, throws `ApiError`)
- Shared components: `LoadingSpinner`, `EmptyState`, `ErrorMessage`, `SuccessMessage`
- TypeScript types in `types/` matching backend DTOs (camelCase)

## Prompt

```
Create [PageName] that fetches [endpoint] on mount.
Required states:
- Loading: LoadingSpinner while fetching
- Error: ErrorMessage with retry
- Empty: EmptyState when no data (with helpful message if filters active)
- Success: render [UI description]

Use useCallback + useEffect for load function.
Do not move to next page until this one is verified with tsc.
```

## Review checklist

- [ ] All four state types handled where applicable
- [ ] `aria-live` / `role="alert"` on error and success
- [ ] API errors use `ApiError` message when available
