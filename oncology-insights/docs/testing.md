# Testing Documentation

## Overview

The OncoInsights platform includes a comprehensive testing suite to ensure functionality, reliability, and maintainability. Tests are implemented using Jest and React Testing Library.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- BiomarkerDataFlow
```

To run tests with coverage reports:

```bash
npm test -- --coverage
```

## Test Structure

The test suite is organized into several categories:

### 1. Unit Tests

Located in `src/components/__tests__/`, these tests focus on individual components in isolation:

- `CohortInputModule.test.tsx`: Tests the cohort selection dropdown
  - Verifies dropdown opens correctly
  - Ensures options selection works properly
  - Confirms the dropdown expands upward as designed
  - Validates option list is updated to only show biomarker options

### 2. Integration Tests

Located in `src/__tests__/`, these tests verify interactions between components and data flow:

- `BiomarkerDataFlow.test.tsx`: Tests the biomarker JSON files and their interconnections
  - Validates required fields exist in all biomarker JSON files
  - Verifies drilldown paths between files
  - Ensures hierarchical navigation between levels 0-3 works as expected

### 3. Application Tests

Located in the root of `src/`:

- `App.test.tsx`: Tests the main application 
  - Verifies the app loads correctly
  - Confirms the biomarker testing category appears in the insights list

## Test Coverage Targets

- Components: 80%+
- Data handling: 90%+
- UI interactions: 75%+

## Adding New Tests

When implementing new features, tests should be added following these guidelines:

1. **Component Tests**: Add test files in `src/components/__tests__/` with the same name as the component
2. **Integration Tests**: Add tests for interactions between components in `src/__tests__/`
3. **Data Tests**: Add tests for new JSON files or data structures

## Mocking

For tests that require data fetching or external dependencies:

```javascript
// Example of mocking fetch calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockData),
  })
);
```

## Snapshot Testing

For UI components that need to preserve their appearance:

```javascript
// Example of snapshot testing
it('matches snapshot', () => {
  const { container } = render(<ComponentName />);
  expect(container).toMatchSnapshot();
});
```

## Accessibility Testing

Use the `jest-axe` library to test for accessibility issues:

```javascript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<ComponentName />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Continuous Integration

Tests are automatically run in the CI pipeline to ensure code quality before merging. All tests must pass before a PR can be merged. 