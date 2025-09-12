import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Text } from '../../atoms/Text/Text';
import { cypherTheme } from '../../../brands/cypher';
import { fluxTheme } from '../../../brands/flux';

describe('Brand System - Multiple Components', () => {
  it('should apply CYPHER brand to multiple components', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
        <Button variant="primary">CYPHER Button</Button>
        <Badge variant="primary">CYPHER Badge</Badge>
        <Text semantic="link">CYPHER Link Text</Text>
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    const badge = getByText('CYPHER Badge');
    const linkText = getByText('CYPHER Link Text');
    
    expect(button).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    expect(linkText).toBeInTheDocument();
    
    // All components should render without errors when using CYPHER brand
    expect(button).toHaveAttribute('data-mond-button');
  });

  it('should apply FLUX brand to multiple components', () => {
    const { getByRole, getByText } = render(
      <ThemeProvider brandTheme={fluxTheme} colorScheme="light">
        <Button variant="primary">FLUX Button</Button>
        <Badge variant="primary">FLUX Badge</Badge>
        <Text semantic="link">FLUX Link Text</Text>
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    const badge = getByText('FLUX Badge');
    const linkText = getByText('FLUX Link Text');
    
    expect(button).toBeInTheDocument();
    expect(badge).toBeInTheDocument();
    expect(linkText).toBeInTheDocument();
  });

  it('should work with dark mode and brand switching', () => {
    const { getByRole } = render(
      <ThemeProvider brandTheme={cypherTheme} colorScheme="dark">
        <Button variant="primary">Dark CYPHER Button</Button>
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).not.toBe('transparent');
  });
});