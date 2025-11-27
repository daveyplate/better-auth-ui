# React Package Tests

This directory contains unit tests for the `@better-auth-ui/react` package.

## Test Structure

- `hooks/` - React hooks tests
- `lib/` - Utility function tests

## Test Files

### Hooks
- `hooks/use-auth.test.tsx` - Auth configuration hook with URL validation tests
- `hooks/use-hydrated.test.tsx` - Client-side hydration detection hook tests

### Utilities
- `lib/utils.test.ts` - className utility (cn) function tests
- `lib/provider-icons.test.ts` - Social provider icon mapping tests

## Running Tests

From the package root:
```bash
bun test
```

From the monorepo root:
```bash
bun test packages/react
```

## Coverage

Generate coverage report:
```bash
bun test:coverage
```

## Testing Patterns

This package uses:
- **Vitest** for test runner
- **React Testing Library** for component testing
- **Jest DOM** for DOM assertions

