import React from 'react';
import { render, screen } from '@testing-library/react';
import { CheckboxGroup, CheckboxOption } from './components/CheckboxGroup/CheckboxGroup';

const simpleOptions: CheckboxOption[] = [
  { value: 'option1', label: 'Option 1' }
];

describe('Debug CheckboxGroup', () => {
  it('should render a simple option', () => {
    render(<CheckboxGroup options={simpleOptions} />);
    
    // Debug what's rendered
    screen.debug();
    
    // Try to find the label
    const labelElement = screen.queryByText('Option 1');
    console.log('Label element found:', labelElement);
    
    // Try to find the input by label text
    const inputByLabel = screen.queryByLabelText('Option 1');
    console.log('Input by label found:', inputByLabel);
    
    expect(true).toBe(true); // Just pass for now
  });
});