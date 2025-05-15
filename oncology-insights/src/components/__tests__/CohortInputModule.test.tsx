import React from 'react';
import { render } from '@testing-library/react';
import { CohortInputModule } from '../CohortInputModule';

// Mock the cohort select function
const mockOnCohortSelect = jest.fn();

describe('CohortInputModule', () => {
  // Simple test to verify the component renders without crashing
  test('renders without crashing', () => {
    render(<CohortInputModule onCohortSelect={mockOnCohortSelect} />);
    // If we get here, the test passed
  });
}); 