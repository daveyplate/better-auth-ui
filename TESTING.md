# Testing Documentation

This monorepo uses [Vitest](https://vitest.dev/) as the testing framework with React Testing Library for component testing.

## Overview

The test suite covers:
- **Core Package** (`@better-auth-ui/core`): Pure TypeScript utilities and configuration
- **React Package** (`@better-auth-ui/react`): React hooks, components, and utilities
- **HeroUI Package** (`@better-auth-ui/heroui`): HeroUI component implementations

## Running Tests

### All Tests
```bash
bun test
```

### Specific Package
```bash
bun test packages/core
bun test packages/react
bun test packages/heroui
```

### Watch Mode
```bash
bun test --watch
```

### Coverage Report
```bash
bun test:coverage
```

### UI Mode
```bash
bun test:ui
```

## Test Structure