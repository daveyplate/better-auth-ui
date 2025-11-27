# Core Package Tests

This directory contains unit tests for the `@better-auth-ui/core` package.

## Test Files

- `base-paths.test.ts` - Tests for base URL paths configuration
- `provider-names.test.ts` - Tests for social provider name mappings and utilities
- `view-paths.test.ts` - Tests for authentication view path configurations

## Running Tests

From the package root:
```bash
bun test
```

From the monorepo root:
```bash
bun test packages/core
```

## Coverage

Generate coverage report:
```bash
bun test:coverage
```