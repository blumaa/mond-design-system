import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Grid } from './Grid';

describe('Grid Component', () => {
  it('renders children correctly', () => {
    render(
      <Grid data-testid="grid">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
        <div>Item 4</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByText('Item 4')).toBeInTheDocument();
  });

  it('applies grid display', () => {
    render(
      <Grid data-testid="grid">
        <div>Item</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('display: grid');
  });

  it('applies columns from number prop', () => {
    render(
      <Grid columns={3} data-testid="grid">
        <div>Item</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
  });

  it('applies custom template columns', () => {
    render(
      <Grid templateColumns="200px 1fr 100px" data-testid="grid">
        <div>Item</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: 200px 1fr 100px');
  });

  it('applies gap spacing', () => {
    render(
      <Grid gap={20} data-testid="grid">
        <div>Item</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('gap: 20px');
  });

  it('forwards additional Box props', () => {
    render(
      <Grid bg="#f5f5f5" p={12} data-testid="grid">
        <div>Item</div>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('background-color: #f5f5f5');
    expect(grid).toHaveStyle('padding: 12px');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Grid ref={ref}>
        <div>Item</div>
      </Grid>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});