import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressStepper, StepConfig } from './ProgressStepper';

const mockSteps: StepConfig[] = [
  { label: 'Personal Info', description: 'Enter your details' },
  { label: 'Account Setup', description: 'Create your account' },
  { label: 'Preferences', description: 'Set your preferences' },
  { label: 'Confirmation', description: 'Review and confirm' },
];

const mockStepsWithIcons: StepConfig[] = [
  { label: 'Start', icon: '🚀' },
  { label: 'Process', icon: '⚙️' },
  { label: 'Complete', icon: '✅' },
];

const mockStepsWithStatus: StepConfig[] = [
  { label: 'Step 1', status: 'completed' },
  { label: 'Step 2', status: 'active' },
  { label: 'Step 3', status: 'disabled' },
  { label: 'Step 4', status: 'error' },
];

describe('ProgressStepper Component', () => {
  it('renders stepper with steps', () => {
    render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    const stepper = screen.getByTestId('progress-stepper');
    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute('role', 'progressbar');
    expect(stepper).toHaveAttribute('aria-valuenow', '2'); // currentStep + 1
    expect(stepper).toHaveAttribute('aria-valuemax', '4');
    expect(stepper).toHaveAttribute('aria-label', 'Step 2 of 4');
  });

  it('displays all step labels', () => {
    render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Account Setup')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
  });

  it('displays step descriptions', () => {
    render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByText('Enter your details')).toBeInTheDocument();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Set your preferences')).toBeInTheDocument();
    expect(screen.getByText('Review and confirm')).toBeInTheDocument();
  });

  it('shows correct step numbers by default', () => {
    render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    // Step 0 should be completed (✓), step 1 active (2), steps 2,3 disabled (3,4)
    expect(screen.getByText('✓')).toBeInTheDocument(); // Completed step 0
    expect(screen.getByText('2')).toBeInTheDocument(); // Active step 1 
    expect(screen.getByText('3')).toBeInTheDocument(); // Disabled step 2
    expect(screen.getByText('4')).toBeInTheDocument(); // Disabled step 3
  });

  it('displays custom icons when provided', () => {
    render(
      <ProgressStepper
        steps={mockStepsWithIcons}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('⚙️')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('handles currentStep prop correctly', () => {
    const { rerender } = render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={0}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByTestId('progress-stepper')).toHaveAttribute('aria-valuenow', '1');
    
    rerender(
      <ProgressStepper
        steps={mockSteps}
        currentStep={2}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByTestId('progress-stepper')).toHaveAttribute('aria-valuenow', '3');
  });

  it('clamps currentStep to valid range', () => {
    const { rerender } = render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={-1}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByTestId('progress-stepper')).toHaveAttribute('aria-valuenow', '1');
    
    rerender(
      <ProgressStepper
        steps={mockSteps}
        currentStep={10}
        data-testid="progress-stepper"
      />
    );
    
    expect(screen.getByTestId('progress-stepper')).toHaveAttribute('aria-valuenow', '4');
  });

  describe('orientation', () => {
    it('applies horizontal orientation by default', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      const stepper = screen.getByTestId('progress-stepper');
      expect(stepper).toBeInTheDocument();
    });

    it('applies vertical orientation', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          orientation="vertical"
          data-testid="progress-stepper"
        />
      );
      
      const stepper = screen.getByTestId('progress-stepper');
      expect(stepper).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          size="small"
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.getByTestId('progress-stepper')).toBeInTheDocument();
    });

    it('applies medium size by default', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.getByTestId('progress-stepper')).toBeInTheDocument();
    });

    it('applies large size', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          size="large"
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.getByTestId('progress-stepper')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant by default', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      // Should show labels and descriptions
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Enter your details')).toBeInTheDocument();
    });

    it('applies compact variant and hides labels', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          variant="compact"
          data-testid="progress-stepper"
        />
      );
      
      // Should hide labels and descriptions in compact mode
      expect(screen.queryByText('Personal Info')).not.toBeInTheDocument();
      expect(screen.queryByText('Enter your details')).not.toBeInTheDocument();
      
      // But should still show step numbers/icons (step 0 completed, step 1 active)
      expect(screen.getByText('✓')).toBeInTheDocument(); // Completed step 0
      expect(screen.getByText('2')).toBeInTheDocument(); // Active step 1
    });
  });

  describe('step navigation', () => {
    it('does not allow navigation by default', () => {
      const mockOnStepClick = jest.fn();
      
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          onStepClick={mockOnStepClick}
          data-testid="progress-stepper"
        />
      );
      
      const firstStep = screen.getByText('Personal Info').closest('div');
      fireEvent.click(firstStep!);
      
      expect(mockOnStepClick).not.toHaveBeenCalled();
    });

    it('allows navigation when allowStepNavigation is true', () => {
      const mockOnStepClick = jest.fn();
      
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={2}
          allowStepNavigation={true}
          onStepClick={mockOnStepClick}
          data-testid="progress-stepper"
        />
      );
      
      const firstStep = screen.getByText('Personal Info').closest('div');
      fireEvent.click(firstStep!);
      
      expect(mockOnStepClick).toHaveBeenCalledWith(0);
    });

    it('calls onStepClick with correct step index', () => {
      const mockOnStepClick = jest.fn();
      
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          allowStepNavigation={true}
          onStepClick={mockOnStepClick}
          data-testid="progress-stepper"
        />
      );
      
      // Click on third step
      const thirdStep = screen.getByText('Preferences').closest('div');
      fireEvent.click(thirdStep!);
      
      expect(mockOnStepClick).toHaveBeenCalledWith(2);
    });

    it('does not call onStepClick for steps with explicit status', () => {
      const mockOnStepClick = jest.fn();
      
      render(
        <ProgressStepper
          steps={mockStepsWithStatus}
          currentStep={1}
          allowStepNavigation={true}
          onStepClick={mockOnStepClick}
          data-testid="progress-stepper"
        />
      );
      
      // Click on step with explicit status
      const firstStep = screen.getByText('Step 1').closest('div');
      fireEvent.click(firstStep!);
      
      expect(mockOnStepClick).not.toHaveBeenCalled();
    });
  });

  describe('step status', () => {
    it('respects explicit step status', () => {
      render(
        <ProgressStepper
          steps={mockStepsWithStatus}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      // All steps should be rendered regardless of explicit status
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('Step 4')).toBeInTheDocument();
    });

    it('auto-determines status based on currentStep', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      // Step 0 should be completed (< currentStep)
      // Step 1 should be active (= currentStep)
      // Steps 2,3 should be disabled (> currentStep)
      expect(screen.getByTestId('progress-stepper')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('returns null when no steps provided', () => {
      // Suppress console.warn for this test since we're intentionally testing error case
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(
        <ProgressStepper
          steps={[]}
          currentStep={0}
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.queryByTestId('progress-stepper')).not.toBeInTheDocument();
      
      // Verify the warning was called and restore console.warn
      expect(consoleSpy).toHaveBeenCalledWith('ProgressStepper: No steps provided');
      consoleSpy.mockRestore();
    });

    it('provides default labels for steps without labels', () => {
      const stepsWithoutLabels = [
        { label: '' },
        { label: '' },
      ];
      
      render(
        <ProgressStepper
          steps={stepsWithoutLabels}
          currentStep={0}
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          isDarkMode={true}
          data-testid="progress-stepper"
        />
      );
      
      expect(screen.getByTestId('progress-stepper')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={2}
          data-testid="progress-stepper"
        />
      );
      
      const stepper = screen.getByTestId('progress-stepper');
      expect(stepper).toHaveAttribute('role', 'progressbar');
      expect(stepper).toHaveAttribute('aria-valuenow', '3');
      expect(stepper).toHaveAttribute('aria-valuemin', '1');
      expect(stepper).toHaveAttribute('aria-valuemax', '4');
      expect(stepper).toHaveAttribute('aria-label', 'Step 3 of 4');
    });

    it('supports keyboard navigation when allowStepNavigation is true', () => {
      const mockOnStepClick = jest.fn();
      
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          allowStepNavigation={true}
          onStepClick={mockOnStepClick}
          data-testid="progress-stepper"
        />
      );
      
      // Steps should be clickable - find the step container
      const stepContainers = screen.getByTestId('progress-stepper').children;
      expect(stepContainers[0]).toHaveStyle({ cursor: 'pointer' });
    });

    it('has correct cursor styles for non-navigable steps', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          allowStepNavigation={false}
          data-testid="progress-stepper"
        />
      );
      
      // Steps should not be clickable - find the step container
      const stepContainers = screen.getByTestId('progress-stepper').children;
      expect(stepContainers[0]).toHaveStyle({ cursor: 'default' });
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <ProgressStepper
        ref={ref}
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('progress-stepper'));
  });

  it('passes through additional props', () => {
    render(
      <ProgressStepper
        steps={mockSteps}
        currentStep={1}
        data-testid="progress-stepper"
        className="custom-class"
        aria-describedby="custom-description"
      />
    );
    
    const stepper = screen.getByTestId('progress-stepper');
    expect(stepper).toHaveClass('custom-class');
    expect(stepper).toHaveAttribute('aria-describedby', 'custom-description');
  });

  describe('completed steps indicator', () => {
    it('shows checkmark for completed steps', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={2} // Steps 0 and 1 should be completed
          data-testid="progress-stepper"
        />
      );
      
      // Should show checkmarks for completed steps
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks).toHaveLength(2); // Steps 0 and 1
    });

    it('shows numbers for non-completed steps', () => {
      render(
        <ProgressStepper
          steps={mockSteps}
          currentStep={1}
          data-testid="progress-stepper"
        />
      );
      
      // Step 0 completed (✓), step 1 active (2), steps 2,3 disabled (3,4)
      expect(screen.getByText('✓')).toBeInTheDocument(); // Completed step 0
      expect(screen.getByText('2')).toBeInTheDocument(); // Active step 1 
      expect(screen.getByText('3')).toBeInTheDocument(); // Disabled step 2
      expect(screen.getByText('4')).toBeInTheDocument(); // Disabled step 3
    });
  });
});