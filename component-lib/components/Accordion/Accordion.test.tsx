import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion, AccordionItem } from './Accordion';

// Mock animation duration to speed up tests
const mockItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'First Item',
    content: 'Content for the first item',
  },
  {
    id: 'item-2',
    title: 'Second Item',
    content: 'Content for the second item',
    defaultExpanded: true,
  },
  {
    id: 'item-3',
    title: 'Third Item',
    content: 'Content for the third item',
    disabled: true,
  },
];

const customItems: AccordionItem[] = [
  {
    id: 'custom-1',
    title: <span>Custom Title</span>,
    content: <div>Custom content with <strong>HTML</strong></div>,
    icon: <span>📋</span>,
  },
];

describe('Accordion Component', () => {
  describe('Basic Rendering', () => {
    it('renders accordion with items', () => {
      render(<Accordion items={mockItems} />);
      
      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Accordion items={mockItems} className="custom-accordion" />);
      
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toHaveClass('custom-accordion');
    });

    it('renders with proper ARIA attributes', () => {
      render(<Accordion items={mockItems} />);
      
      const headers = screen.getAllByRole('button');
      const regions = screen.getAllByRole('region');
      
      headers.forEach(header => {
        expect(header).toHaveAttribute('aria-expanded');
        expect(header).toHaveAttribute('aria-controls');
      });
      
      // First region is the main accordion container
      expect(regions[0]).toHaveAttribute('aria-label', 'Accordion');
      
      // Other regions are content panels
      regions.slice(1).forEach(region => {
        expect(region).toHaveAttribute('aria-labelledby');
      });
    });
  });

  describe('Single Mode (Default)', () => {
    it('expands item on click', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      fireEvent.click(firstButton);
      
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content for the first item')).toBeInTheDocument();
    });

    it('collapses expanded item when clicking another', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      // Expand first item
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      
      // Expand second item (should collapse first)
      fireEvent.click(secondButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('allows toggle off when allowToggleOff is true', () => {
      render(<Accordion items={mockItems} allowToggleOff />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      
      // Expand
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      
      // Collapse
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('prevents toggle off when allowToggleOff is false', () => {
      render(<Accordion items={mockItems} allowToggleOff={false} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      
      // Expand
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      
      // Try to collapse (should remain expanded)
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items to be expanded', () => {
      const testItems: AccordionItem[] = [
        {
          id: 'item-1',
          title: 'First Item',
          content: 'Content for the first item',
        },
        {
          id: 'item-2',
          title: 'Second Item',
          content: 'Content for the second item',
        },
      ];
      
      render(<Accordion items={testItems} mode="multiple" />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      fireEvent.click(firstButton);
      fireEvent.click(secondButton);
      
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles individual items independently', () => {
      const testItems: AccordionItem[] = [
        {
          id: 'item-1',
          title: 'First Item',
          content: 'Content for the first item',
        },
        {
          id: 'item-2',
          title: 'Second Item',
          content: 'Content for the second item',
        },
      ];
      
      render(<Accordion items={testItems} mode="multiple" />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      // Expand both
      fireEvent.click(firstButton);
      fireEvent.click(secondButton);
      
      // Collapse first
      fireEvent.click(firstButton);
      
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled state', () => {
      const onExpandedChange = jest.fn();
      
      render(
        <Accordion 
          items={mockItems} 
          expandedIds={['item-1']} 
          onExpandedChange={onExpandedChange}
        />
      );
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(secondButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(secondButton);
      expect(onExpandedChange).toHaveBeenCalledWith(['item-2']);
    });

    it('handles multiple mode in controlled state', () => {
      const onExpandedChange = jest.fn();
      
      render(
        <Accordion 
          items={mockItems} 
          mode="multiple"
          expandedIds={['item-1']} 
          onExpandedChange={onExpandedChange}
        />
      );
      
      const secondButton = screen.getByRole('button', { name: /second item/i });
      fireEvent.click(secondButton);
      
      expect(onExpandedChange).toHaveBeenCalledWith(['item-1', 'item-2']);
    });
  });

  describe('Disabled Items', () => {
    it('does not expand disabled items', () => {
      render(<Accordion items={mockItems} />);
      
      const disabledButton = screen.getByRole('button', { name: /third item/i });
      
      expect(disabledButton).toBeDisabled();
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');
      
      fireEvent.click(disabledButton);
      expect(disabledButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('skips disabled items in keyboard navigation', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      firstButton.focus();
      
      // Arrow down should go to second item (skipping disabled third item)
      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(secondButton);
      
      // Arrow down again should wrap to first item (skipping disabled third item)
      fireEvent.keyDown(secondButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('Keyboard Navigation', () => {
    it('expands/collapses on Enter key', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      firstButton.focus();
      
      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands/collapses on Space key', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      firstButton.focus();
      
      fireEvent.keyDown(firstButton, { key: ' ' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      
      fireEvent.keyDown(firstButton, { key: ' ' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('navigates with arrow keys', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      firstButton.focus();
      
      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(secondButton);
      
      fireEvent.keyDown(secondButton, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(firstButton);
    });

    it('navigates to first/last item with Home/End', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      
      firstButton.focus();
      
      // End should go to last non-disabled item (second item, since third is disabled)
      fireEvent.keyDown(firstButton, { key: 'End' });
      expect(document.activeElement).toBe(secondButton);
      
      // Home should go back to first item
      fireEvent.keyDown(secondButton, { key: 'Home' });
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Accordion items={mockItems} variant="default" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('renders bordered variant', () => {
      render(<Accordion items={mockItems} variant="bordered" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('renders filled variant', () => {
      render(<Accordion items={mockItems} variant="filled" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      render(<Accordion items={mockItems} size="sm" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('renders medium size by default', () => {
      render(<Accordion items={mockItems} size="md" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('renders large size', () => {
      render(<Accordion items={mockItems} size="lg" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders custom icons per item', () => {
      render(<Accordion items={customItems} />);
      expect(screen.getByText('📋')).toBeInTheDocument();
    });

    it('renders default icon when no custom icon provided', () => {
      render(<Accordion items={mockItems} icon={<span>🔽</span>} />);
      expect(screen.getAllByText('🔽')).toHaveLength(mockItems.length);
    });

    it('positions icon on the left when specified', () => {
      render(<Accordion items={mockItems} iconPosition="left" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('positions icon on the right by default', () => {
      render(<Accordion items={mockItems} iconPosition="right" />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('enables animations by default', () => {
      render(<Accordion items={mockItems} animated />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('disables animations when specified', () => {
      render(<Accordion items={mockItems} animated={false} />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode styles', () => {
      render(<Accordion items={mockItems} isDarkMode />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });

    it('applies light mode by default', () => {
      render(<Accordion items={mockItems} isDarkMode={false} />);
      const accordion = screen.getByRole('region', { name: /accordion/i });
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Default Expanded State', () => {
    it('respects defaultExpanded in uncontrolled mode', () => {
      render(<Accordion items={mockItems} />);
      
      // Second item has defaultExpanded: true
      const secondButton = screen.getByRole('button', { name: /second item/i });
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content for the second item')).toBeInTheDocument();
    });

    it('ignores defaultExpanded for disabled items', () => {
      const itemsWithDisabledExpanded: AccordionItem[] = [
        {
          id: 'disabled-expanded',
          title: 'Disabled Expanded',
          content: 'Should not be expanded',
          disabled: true,
          defaultExpanded: true,
        },
      ];
      
      render(<Accordion items={itemsWithDisabledExpanded} />);
      
      const button = screen.getByRole('button', { name: /disabled expanded/i });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Custom Content', () => {
    it('renders custom title components', () => {
      render(<Accordion items={customItems} />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders custom content components', () => {
      render(<Accordion items={customItems} />);
      
      const button = screen.getByRole('button', { name: /custom title/i });
      fireEvent.click(button);
      
      expect(screen.getByText('Custom content with')).toBeInTheDocument();
      expect(screen.getByText('HTML')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Accordion ref={ref} items={mockItems} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-mond-accordion');
    });
  });

  describe('Event Handling', () => {
    it('handles mouse interactions on headers', () => {
      render(<Accordion items={mockItems} />);
      
      const firstButton = screen.getByRole('button', { name: /first item/i });
      
      fireEvent.mouseEnter(firstButton);
      fireEvent.mouseLeave(firstButton);
      fireEvent.focus(firstButton);
      fireEvent.blur(firstButton);
      
      expect(firstButton).toBeInTheDocument();
    });

    it('prevents keyboard events on disabled items', () => {
      render(<Accordion items={mockItems} />);
      
      const disabledButton = screen.getByRole('button', { name: /third item/i });
      
      fireEvent.keyDown(disabledButton, { key: 'Enter' });
      fireEvent.keyDown(disabledButton, { key: ' ' });
      
      expect(disabledButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});