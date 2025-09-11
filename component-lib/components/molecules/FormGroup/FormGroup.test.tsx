import React from 'react';
import { render, screen } from '../../../test-utils';
import '@testing-library/jest-dom';
import { FormGroup } from './FormGroup';
import { FormField } from '../FormField/FormField';
import { Input } from '../../atoms/Input/Input';

describe('FormGroup Component', () => {
  it('renders children correctly', () => {
    render(
      <FormGroup data-testid="form-group">
        <FormField label="First Field">
          <Input placeholder="First input" />
        </FormField>
        <FormField label="Second Field">
          <Input placeholder="Second input" />
        </FormField>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    const firstInput = screen.getByPlaceholderText('First input');
    const secondInput = screen.getByPlaceholderText('Second input');
    
    expect(formGroup).toBeInTheDocument();
    expect(firstInput).toBeInTheDocument();
    expect(secondInput).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <FormGroup title="Personal Information" data-testid="form-group">
        <FormField label="Name">
          <Input placeholder="Enter name" />
        </FormField>
      </FormGroup>
    );
    
    const title = screen.getByText('Personal Information');
    expect(title).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <FormGroup 
        title="Account Settings"
        description="Configure your account preferences"
        data-testid="form-group"
      >
        <FormField label="Email">
          <Input placeholder="Enter email" />
        </FormField>
      </FormGroup>
    );
    
    const title = screen.getByText('Account Settings');
    const description = screen.getByText('Configure your account preferences');
    
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('renders description without title', () => {
    render(
      <FormGroup 
        description="Fill out the form below"
        data-testid="form-group"
      >
        <FormField label="Field">
          <Input placeholder="Enter value" />
        </FormField>
      </FormGroup>
    );
    
    const description = screen.getByText('Fill out the form below');
    const title = screen.queryByRole('heading');
    
    expect(description).toBeInTheDocument();
    expect(title).not.toBeInTheDocument();
  });

  it('renders without title and description', () => {
    render(
      <FormGroup data-testid="form-group">
        <FormField label="Field">
          <Input placeholder="Enter value" />
        </FormField>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    const input = screen.getByPlaceholderText('Enter value');
    
    expect(formGroup).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('applies custom spacing', () => {
    render(
      <FormGroup spacing={32} title="Custom Spacing" data-testid="form-group">
        <FormField label="Field">
          <Input placeholder="Enter value" />
        </FormField>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <FormGroup ref={ref} data-testid="form-group">
        <FormField label="Field">
          <Input placeholder="Test input" />
        </FormField>
      </FormGroup>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    render(
      <FormGroup className="custom-form-group" data-testid="form-group">
        <FormField label="Field">
          <Input placeholder="Test input" />
        </FormField>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toHaveClass('custom-form-group');
  });

  it('handles single child', () => {
    render(
      <FormGroup title="Single Field" data-testid="form-group">
        <FormField label="Only Field">
          <Input placeholder="Single input" />
        </FormField>
      </FormGroup>
    );
    
    const title = screen.getByText('Single Field');
    const input = screen.getByPlaceholderText('Single input');
    
    expect(title).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('handles multiple children of different types', () => {
    render(
      <FormGroup title="Mixed Content" data-testid="form-group">
        <FormField label="Input Field">
          <Input placeholder="Text input" />
        </FormField>
        <div>Custom content</div>
        <FormField label="Another Field">
          <Input placeholder="Another input" />
        </FormField>
      </FormGroup>
    );
    
    const title = screen.getByText('Mixed Content');
    const textInput = screen.getByPlaceholderText('Text input');
    const customContent = screen.getByText('Custom content');
    const anotherInput = screen.getByPlaceholderText('Another input');
    
    expect(title).toBeInTheDocument();
    expect(textInput).toBeInTheDocument();
    expect(customContent).toBeInTheDocument();
    expect(anotherInput).toBeInTheDocument();
  });

  it('has default spacing when not specified', () => {
    render(
      <FormGroup title="Default Spacing" data-testid="form-group">
        <FormField label="Field">
          <Input placeholder="Test input" />
        </FormField>
      </FormGroup>
    );
    
    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
  });

  describe('structure', () => {
    it('renders header section when title or description provided', () => {
      render(
        <FormGroup 
          title="Form Title"
          description="Form description"
          data-testid="form-group"
        >
          <FormField label="Field">
            <Input placeholder="Test input" />
          </FormField>
        </FormGroup>
      );
      
      const title = screen.getByText('Form Title');
      const description = screen.getByText('Form description');
      
      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    it('does not render header when no title or description', () => {
      render(
        <FormGroup data-testid="form-group">
          <FormField label="Field">
            <Input placeholder="Test input" />
          </FormField>
        </FormGroup>
      );
      
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      
      // Should only have the form fields section, no header section
      const formGroup = screen.getByTestId('form-group');
      expect(formGroup).toBeInTheDocument();
    });
  });
});