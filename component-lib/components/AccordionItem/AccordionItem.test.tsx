import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionItem, type AccordionItemProps } from './AccordionItem';

const defaultProps: AccordionItemProps = {
  title: 'Test Title',
  children: 'Test Content',
};

describe('AccordionItem', () => {
  it('renders with title and content', () => {
    render(<AccordionItem {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders custom title as ReactNode', () => {
    render(
      <AccordionItem title={<span data-testid="custom-title">Custom Title</span>}>
        Content
      </AccordionItem>
    );
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  describe('Expansion State', () => {
    it('expands by default when defaultExpanded is true', () => {
      render(<AccordionItem {...defaultProps} defaultExpanded />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles expansion on click', () => {
      render(<AccordionItem {...defaultProps} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('works in controlled mode', () => {
      const onExpandedChange = jest.fn();
      render(<AccordionItem {...defaultProps} expanded={true} onExpandedChange={onExpandedChange} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(trigger);
      expect(onExpandedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles on Enter and Space keys', () => {
      render(<AccordionItem {...defaultProps} />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(trigger, { key: ' ' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Disabled State', () => {
    it('does not toggle when disabled', () => {
      render(<AccordionItem {...defaultProps} disabled />);

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Sizes and Variants', () => {
    it('applies size and variant classes', () => {
      const { rerender } = render(<AccordionItem {...defaultProps} variant="default" size="sm" />);

      let accordion = screen.getByRole('button').parentElement;
      expect(accordion).toHaveClass('mond-accordion-item--default');
      expect(accordion).toHaveClass('mond-accordion-item--sm');

      rerender(<AccordionItem {...defaultProps} variant="bordered" size="lg" />);
      accordion = screen.getByRole('button').parentElement;
      expect(accordion).toHaveClass('mond-accordion-item--bordered');
      expect(accordion).toHaveClass('mond-accordion-item--lg');
    });
  });

  describe('Icon Support', () => {
    it('renders default chevron icon and positions it correctly', () => {
      const { rerender } = render(<AccordionItem {...defaultProps} />);

      let trigger = screen.getByRole('button');
      let svg = trigger.querySelector('svg');
      expect(svg).toBeInTheDocument();

      const lastChild = trigger.children[trigger.children.length - 1];
      expect(lastChild).toContainElement(svg);

      rerender(<AccordionItem {...defaultProps} iconPosition="left" />);
      trigger = screen.getByRole('button');
      svg = trigger.querySelector('svg');
      const firstChild = trigger.children[0];
      expect(firstChild).toContainElement(svg);
    });

    it('renders custom icon', () => {
      render(<AccordionItem {...defaultProps} icon={<span data-testid="custom-icon">→</span>} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Event Callbacks', () => {
    it('calls onExpandedChange with correct values', () => {
      const onExpandedChange = jest.fn();
      render(<AccordionItem {...defaultProps} onExpandedChange={onExpandedChange} />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(onExpandedChange).toHaveBeenCalledWith(true);

      fireEvent.click(trigger);
      expect(onExpandedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('ARIA Support', () => {
    it('has proper ARIA attributes', () => {
      render(<AccordionItem {...defaultProps} itemId="test-item" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded');
      expect(trigger).toHaveAttribute('aria-controls', 'test-item-content');
      expect(trigger).toHaveAttribute('aria-disabled');

      const content = screen.getByText('Test Content').parentElement;
      expect(content).toHaveAttribute('id', 'test-item-content');
      expect(content).toHaveAttribute('aria-hidden');
    });

    it('handles missing itemId gracefully', () => {
      render(<AccordionItem {...defaultProps} />);

      const trigger = screen.getByRole('button');
      expect(trigger).not.toHaveAttribute('aria-controls');

      const content = screen.getByText('Test Content').parentElement;
      expect(content).not.toHaveAttribute('id');
    });
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AccordionItem ref={ref} {...defaultProps} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
