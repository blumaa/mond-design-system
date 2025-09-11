import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import { AccordionItem, type AccordionItemProps } from './AccordionItem';

const defaultProps: AccordionItemProps = {
  title: 'Test Title',
  children: 'Test Content',
};

const renderAccordionItem = (props: Partial<AccordionItemProps> = {}) => {
  return render(<AccordionItem {...defaultProps} {...props} />);
};

describe('AccordionItem', () => {
  describe('Basic Rendering', () => {
    it('renders with title and content', () => {
      renderAccordionItem();
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom title as ReactNode', () => {
      renderAccordionItem({
        title: <span data-testid="custom-title">Custom Title</span>
      });
      
      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      renderAccordionItem({ className: 'custom-class' });
      
      const accordion = screen.getByRole('button').parentElement;
      expect(accordion).toHaveClass('mond-accordion-item');
      expect(accordion).toHaveClass('custom-class');
    });
  });

  describe('Expansion State', () => {
    it('is collapsed by default', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      const content = screen.getByText('Test Content');
      expect(content.parentElement).toHaveStyle({ maxHeight: '0px' });
    });

    it('can be expanded by default', () => {
      renderAccordionItem({ defaultExpanded: true });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('supports controlled expansion', () => {
      const onExpandedChange = jest.fn();
      renderAccordionItem({
        expanded: true,
        onExpandedChange
      });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles expansion on click', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles on Enter key', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles on Space key', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.keyDown(trigger, { key: ' ' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('ignores other keys', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled', () => {
      renderAccordionItem({ disabled: true });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      
      const accordion = trigger.parentElement;
      expect(accordion).toHaveClass('mond-accordion-item--disabled');
    });

    it('does not toggle when disabled and clicked', () => {
      renderAccordionItem({ disabled: true });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not toggle when disabled and key pressed', () => {
      renderAccordionItem({ disabled: true });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Size Variants', () => {
    it.each(['sm', 'md', 'lg'] as const)('applies %s size class', (size) => {
      renderAccordionItem({ size });
      
      const accordion = screen.getByRole('button').parentElement;
      expect(accordion).toHaveClass(`mond-accordion-item--${size}`);
    });
  });

  describe('Visual Variants', () => {
    it.each(['default', 'bordered', 'filled'] as const)('applies %s variant class', (variant) => {
      renderAccordionItem({ variant });
      
      const accordion = screen.getByRole('button').parentElement;
      expect(accordion).toHaveClass(`mond-accordion-item--${variant}`);
    });
  });

  describe('Icon Support', () => {
    it('renders default chevron icon', () => {
      renderAccordionItem();
      
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders custom icon', () => {
      renderAccordionItem({
        icon: <span data-testid="custom-icon">→</span>
      });
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('positions icon on the left', () => {
      renderAccordionItem({ iconPosition: 'left' });
      
      const trigger = screen.getByRole('button');
      const firstChild = trigger.children[0];
      expect(firstChild).toContainElement(trigger.querySelector('svg'));
    });

    it('positions icon on the right by default', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      const lastChild = trigger.children[trigger.children.length - 1];
      expect(lastChild).toContainElement(trigger.querySelector('svg'));
    });
  });

  describe('Event Callbacks', () => {
    it('calls onExpandedChange when toggled', () => {
      const onExpandedChange = jest.fn();
      renderAccordionItem({ onExpandedChange });
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('calls onExpandedChange with correct values', () => {
      const onExpandedChange = jest.fn();
      renderAccordionItem({ onExpandedChange, defaultExpanded: true });
      
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      
      expect(onExpandedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode styling', () => {
      renderAccordionItem({ isDarkMode: true });
      
      // Dark mode styling is applied via CSS-in-JS, 
      // so we just verify the prop is handled without errors
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('ARIA Support', () => {
    it('has proper ARIA attributes', () => {
      renderAccordionItem({ itemId: 'test-item' });
      
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded');
      expect(trigger).toHaveAttribute('aria-controls', 'test-item-content');
      expect(trigger).toHaveAttribute('aria-disabled');
      
      const content = screen.getByText('Test Content').parentElement;
      expect(content).toHaveAttribute('id', 'test-item-content');
      expect(content).toHaveAttribute('aria-hidden');
    });

    it('handles missing itemId gracefully', () => {
      renderAccordionItem();
      
      const trigger = screen.getByRole('button');
      expect(trigger).not.toHaveAttribute('aria-controls');
      
      const content = screen.getByText('Test Content').parentElement;
      expect(content).not.toHaveAttribute('id');
    });
  });

  describe('Integration', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<AccordionItem ref={ref} {...defaultProps} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('spreads additional props', () => {
      renderAccordionItem({ 'data-testid': 'accordion-item' });
      
      expect(screen.getByTestId('accordion-item')).toBeInTheDocument();
    });
  });
});