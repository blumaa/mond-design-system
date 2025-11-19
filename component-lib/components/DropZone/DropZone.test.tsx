import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DndContext } from '@dnd-kit/core';
import { DropZone } from './DropZone';
import { DropZoneItem } from './DropZoneItem';

// Wrapper component to provide DndContext
function DndWrapper({ children }: { children: React.ReactNode }) {
  return <DndContext>{children}</DndContext>;
}

describe('DropZone', () => {
  describe('Rendering', () => {
    it('renders empty placeholder by default', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" />
        </DndWrapper>
      );

      expect(screen.getByText('Drop components here')).toBeInTheDocument();
    });

    it('renders custom placeholder text', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" placeholder="Custom placeholder" />
        </DndWrapper>
      );

      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });

    it('renders with a single child', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone">
            <DropZoneItem id="item-1" type="Button">
              <div>Test Item</div>
            </DropZoneItem>
          </DropZone>
        </DndWrapper>
      );

      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.queryByText('Drop components here')).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" className="custom-class" data-testid="dropzone" />
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveClass('custom-class');
      expect(dropzone).toHaveClass('mond-dropzone');
    });

    it('applies minimum height when empty', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" minHeight="500px" data-testid="dropzone" />
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveStyle({ minHeight: '500px' });
    });

    it('sets data-dropzone-id attribute', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone-123" data-testid="dropzone" />
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveAttribute('data-dropzone-id', 'test-zone-123');
    });
  });

  describe('States', () => {
    it('applies empty class when no children', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" data-testid="dropzone" />
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveClass('mond-dropzone--empty');
    });

    it('does not apply empty class when has children', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" data-testid="dropzone">
            <DropZoneItem id="item-1" type="Button">
              <div>Item</div>
            </DropZoneItem>
          </DropZone>
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).not.toHaveClass('mond-dropzone--empty');
    });

    it('applies disabled class and attribute when disabled', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" disabled data-testid="dropzone" />
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).toHaveClass('mond-dropzone--disabled');
    });

    it('allows drops when occupied (for swapping)', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" data-testid="dropzone">
            <DropZoneItem id="item-1" type="Button">
              <div>Occupied</div>
            </DropZoneItem>
          </DropZone>
        </DndWrapper>
      );

      const dropzone = screen.getByTestId('dropzone');
      expect(dropzone).not.toHaveClass('mond-dropzone--disabled');
      expect(dropzone).not.toHaveClass('mond-dropzone--empty');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <DndWrapper>
          <DropZone id="test-zone" ref={ref} />
        </DndWrapper>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-dropzone');
    });

    it('accepts data-testid prop', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" data-testid="my-dropzone" />
        </DndWrapper>
      );

      expect(screen.getByTestId('my-dropzone')).toBeInTheDocument();
    });
  });

  describe('Configuration', () => {
    it('accepts array of accepted types', () => {
      render(
        <DndWrapper>
          <DropZone id="test-zone" accepts={['Button', 'Input']} data-testid="dropzone" />
        </DndWrapper>
      );

      // Component should render without errors
      expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    });
  });
});

describe('DropZoneItem', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button">
            <div>Test Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" className="custom-item" data-testid="item">
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      const item = screen.getByTestId('item');
      expect(item).toHaveClass('custom-item');
      expect(item).toHaveClass('mond-dropzone__item');
    });

    it('sets data-testid attribute', () => {
      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" data-testid="my-item">
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(screen.getByTestId('my-item')).toBeInTheDocument();
    });
  });

  describe('Remove Button', () => {
    it('renders remove button by default when onRemove provided', () => {
      const handleRemove = jest.fn();

      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" onRemove={handleRemove} data-testid="item">
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(screen.getByTestId('item-remove')).toBeInTheDocument();
    });

    it('does not render remove button when onRemove not provided', () => {
      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" data-testid="item">
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(screen.queryByTestId('item-remove')).not.toBeInTheDocument();
    });

    it('does not render remove button when showRemoveButton is false', () => {
      const handleRemove = jest.fn();

      render(
        <DndWrapper>
          <DropZoneItem
            id="item-1"
            type="Button"
            onRemove={handleRemove}
            showRemoveButton={false}
            data-testid="item"
          >
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(screen.queryByTestId('item-remove')).not.toBeInTheDocument();
    });

    it('has accessible label on remove button', () => {
      const handleRemove = jest.fn();

      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" onRemove={handleRemove}>
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      const removeButton = screen.getByLabelText('Remove Button');
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <DndWrapper>
          <DropZoneItem id="item-1" type="Button" ref={ref}>
            <div>Content</div>
          </DropZoneItem>
        </DndWrapper>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('mond-dropzone__item');
    });
  });
});
