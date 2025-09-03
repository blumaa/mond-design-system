import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card data-testid="card">
        <div>Card content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default padding', () => {
    render(
      <Card data-testid="card">
        <div>Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('padding: 24px');
  });

  it('applies custom padding', () => {
    render(
      <Card padding={32} data-testid="card">
        <div>Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('padding: 32px');
  });

  it('applies border radius', () => {
    render(
      <Card data-testid="card">
        <div>Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('border-radius: 8px');
  });

  it('forwards additional Box props', () => {
    render(
      <Card width={300} height={200} data-testid="card">
        <div>Content</div>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('width: 300px');
    expect(card).toHaveStyle('height: 200px');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        <div>Content</div>
      </Card>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('Card composition', () => {
    it('renders with header, body, and footer', () => {
      render(
        <Card data-testid="card">
          <CardHeader data-testid="header">
            <h2>Card Title</h2>
          </CardHeader>
          <CardBody data-testid="body">
            <p>Card body content</p>
          </CardBody>
          <CardFooter data-testid="footer">
            <button>Action</button>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card body content')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('applies correct CardFooter styles', () => {
      render(
        <CardFooter data-testid="footer">
          <button>Cancel</button>
          <button>Save</button>
        </CardFooter>
      );
      
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveStyle('display: flex');
      expect(footer).toHaveStyle('justify-content: flex-end');
      expect(footer).toHaveStyle('gap: 12px');
      expect(footer).toHaveStyle('margin-top: 16px');
    });
  });
});