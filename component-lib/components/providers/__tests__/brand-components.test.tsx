import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from '../../Button/Button';
import { Badge } from '../../Badge/Badge';
import { Text } from '../../Text/Text';
import { brand1Theme } from '../../../brands/brand-1';
import { brand2Theme } from '../../../brands/brand-2';

describe('Brand System - Multiple Components', () => {
  it('should apply Brand 1 to multiple components', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider brandTheme={brand1Theme} colorScheme="light">
        <Button variant="primary">Brand 1 Button</Button>
        <Badge variant="primary">Brand 1 Badge</Badge>
        <Text semantic="link">Brand 1 Link Text</Text>
      </ThemeProvider>
    );

    const button = getByRole('button');
    const badge = getByText('Brand 1 Badge');
    const linkText = getByText('Brand 1 Link Text');

    expect(button).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    expect(linkText).toBeInTheDocument();
  });

  it('should apply Brand 2 to multiple components', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider brandTheme={brand2Theme} colorScheme="light">
        <Button variant="primary">Brand 2 Button</Button>
        <Badge variant="primary">Brand 2 Badge</Badge>
        <Text semantic="link">Brand 2 Link Text</Text>
      </ThemeProvider>
    );

    const button = getByRole('button');
    const badge = getByText('Brand 2 Badge');
    const linkText = getByText('Brand 2 Link Text');

    expect(button).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    expect(linkText).toBeInTheDocument();
  });

  it('should work with dark mode and brand switching', () => {
    const { getByRole } = render(
      <ThemeProvider brandTheme={brand1Theme} colorScheme="dark">
        <Button variant="primary">Dark Brand 1 Button</Button>
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).not.toBe('transparent');
  });
});