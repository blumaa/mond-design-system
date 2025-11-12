import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion, AccordionItem } from './Accordion';

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

describe('Accordion Component', () => {
  describe('Basic Rendering', () => {
    it('renders accordion with items and proper ARIA attributes', () => {
      render(<Accordion items={mockItems} />);

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
      expect(screen.getByText('Third Item')).toBeInTheDocument();

      const headers = screen.getAllByRole('button');
      headers.forEach(header => {
        expect(header).toHaveAttribute('aria-expanded');
        expect(header).toHaveAttribute('aria-controls');
      });
    });
  });

  describe('Single Mode', () => {
    it('expands and collapses items correctly', () => {
      render(<Accordion items={mockItems} allowToggleOff />);

      const firstButton = screen.getByRole('button', { name: /first item/i });

      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content for the first item')).toBeInTheDocument();

      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('collapses expanded item when clicking another', () => {
      render(<Accordion items={mockItems} />);

      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });

      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(secondButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Multiple Mode', () => {
    it('allows multiple items to be expanded', () => {
      const testItems: AccordionItem[] = [
        { id: 'item-1', title: 'First Item', content: 'Content 1' },
        { id: 'item-2', title: 'Second Item', content: 'Content 2' },
      ];

      render(<Accordion items={testItems} mode="multiple" />);

      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });

      fireEvent.click(firstButton);
      fireEvent.click(secondButton);

      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled state', () => {
      const onExpandedChange = jest.fn();

      render(<Accordion items={mockItems} expandedIds={['item-1']} onExpandedChange={onExpandedChange} mode="multiple" />);

      const secondButton = screen.getByRole('button', { name: /second item/i });
      fireEvent.click(secondButton);

      expect(onExpandedChange).toHaveBeenCalledWith(['item-1', 'item-2']);
    });
  });

  describe('Disabled Items', () => {
    it('does not expand disabled items and skips in keyboard navigation', () => {
      render(<Accordion items={mockItems} />);

      const disabledButton = screen.getByRole('button', { name: /third item/i });
      expect(disabledButton).toBeDisabled();
      expect(disabledButton).toHaveAttribute('aria-disabled', 'true');

      fireEvent.click(disabledButton);
      expect(disabledButton).toHaveAttribute('aria-expanded', 'false');

      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });
      firstButton.focus();

      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(secondButton);
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles keyboard interactions', () => {
      render(<Accordion items={mockItems} />);

      const firstButton = screen.getByRole('button', { name: /first item/i });
      const secondButton = screen.getByRole('button', { name: /second item/i });

      firstButton.focus();

      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(secondButton);

      fireEvent.keyDown(secondButton, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(firstButton);

      fireEvent.keyDown(firstButton, { key: 'End' });
      expect(document.activeElement).toBe(secondButton);

      fireEvent.keyDown(secondButton, { key: 'Home' });
      expect(document.activeElement).toBe(firstButton);
    });
  });

  describe('Custom Content', () => {
    it('renders custom title and content components', () => {
      const customItems: AccordionItem[] = [
        {
          id: 'custom-1',
          title: <span>Custom Title</span>,
          content: <div>Custom content with <strong>HTML</strong></div>,
          icon: <span>📋</span>,
        },
      ];

      render(<Accordion items={customItems} />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('📋')).toBeInTheDocument();

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
});
