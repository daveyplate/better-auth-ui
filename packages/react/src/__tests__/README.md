# React Package Tests

This directory contains unit tests for the `@better-auth-ui/react` package.

## Test Structure

- `components/__tests__/` - Component tests
- `hooks/__tests__/` - React hooks tests
- `lib/__tests__/` - Utility function tests

## Test Files

### Components
- `auth-provider.test.tsx` - AuthProvider context component tests

### Hooks
- `use-auth.test.tsx` - Auth configuration hook with URL validation tests
- `use-hydrated.test.tsx` - Client-side hydration detection hook tests

### Utilities
- `utils.test.ts` - className utility (cn) function tests
- `provider-icons.test.ts` - Social provider icon mapping tests

### Email Templates
- `email-styles.test.tsx` - Email styling and theming tests

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