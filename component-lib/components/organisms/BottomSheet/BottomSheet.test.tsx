import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';

describe('BottomSheet Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Bottom sheet content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders when isOpen is true', () => {
      render(<BottomSheet {...defaultProps} />);
      expect(screen.getByText('Bottom sheet content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(<BottomSheet {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Bottom sheet content')).not.toBeInTheDocument();
    });

    it('renders with drag handle by default', () => {
      render(<BottomSheet {...defaultProps} />);
      expect(document.querySelector('.bottom-sheet-drag-handle')).toBeInTheDocument();
    });

    it('hides drag handle when showDragHandle is false', () => {
      render(<BottomSheet {...defaultProps} showDragHandle={false} />);
      expect(document.querySelector('.bottom-sheet-drag-handle')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies correct styles for small size', () => {
      render(<BottomSheet {...defaultProps} size="sm" />);
      const sheet = document.querySelector('.bottom-sheet');
      expect(sheet).toHaveStyle({ maxHeight: '30vh', minHeight: '200px' });
    });

    it('applies correct styles for medium size', () => {
      render(<BottomSheet {...defaultProps} size="md" />);
      const sheet = document.querySelector('.bottom-sheet');
      expect(sheet).toHaveStyle({ maxHeight: '50vh', minHeight: '300px' });
    });

    it('applies correct styles for large size', () => {
      render(<BottomSheet {...defaultProps} size="lg" />);
      const sheet = document.querySelector('.bottom-sheet');
      expect(sheet).toHaveStyle({ maxHeight: '70vh', minHeight: '400px' });
    });

    it('applies correct styles for full size', () => {
      render(<BottomSheet {...defaultProps} size="full" />);
      const sheet = document.querySelector('.bottom-sheet');
      expect(sheet).toHaveStyle({ maxHeight: '90vh', minHeight: '60vh' });
    });
  });

  describe('Interaction Behavior', () => {
    it('calls onClose when overlay is clicked', async () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} />);
      
      const overlay = document.querySelector('.bottom-sheet-overlay');
      fireEvent.click(overlay!);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />);
      
      const overlay = document.querySelector('.bottom-sheet-overlay');
      fireEvent.click(overlay!);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when Escape key is pressed and closeOnEscapeKey is false', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} closeOnEscapeKey={false} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when clicking inside the sheet', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} />);
      
      const content = screen.getByText('Bottom sheet content');
      fireEvent.click(content);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Drag Functionality', () => {
    it('handles mouse drag events on drag handle', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} />);
      
      const dragHandle = document.querySelector('.bottom-sheet-drag-handle');
      
      // Start drag
      fireEvent.mouseDown(dragHandle!, { clientY: 100 });
      
      // Drag down
      fireEvent.mouseMove(document, { clientY: 250 });
      
      // End drag
      fireEvent.mouseUp(document);
      
      // Should close when dragged more than 100px
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('handles touch drag events on drag handle', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} />);
      
      const dragHandle = document.querySelector('.bottom-sheet-drag-handle');
      
      // Start drag
      fireEvent.touchStart(dragHandle!, { 
        touches: [{ clientY: 100 }] 
      });
      
      // Drag down
      fireEvent.touchMove(document, { 
        touches: [{ clientY: 250 }] 
      });
      
      // End drag
      fireEvent.touchEnd(document);
      
      // Should close when dragged more than 100px
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not trigger drag when enableDragToClose is false', () => {
      const onClose = jest.fn();
      render(<BottomSheet {...defaultProps} onClose={onClose} enableDragToClose={false} />);
      
      const dragHandle = document.querySelector('.bottom-sheet-drag-handle');
      
      // Try to drag
      fireEvent.mouseDown(dragHandle!, { clientY: 100 });
      fireEvent.mouseMove(document, { clientY: 250 });
      fireEvent.mouseUp(document);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Dark Mode', () => {
    it('applies dark mode styles when isDarkMode is true', () => {
      render(<BottomSheet {...defaultProps} isDarkMode />);
      const sheet = document.querySelector('.bottom-sheet');
      
      // The exact color will depend on theme implementation
      expect(sheet).toHaveAttribute('style');
    });
  });

  describe('Accessibility', () => {
    it('locks body scroll when open', () => {
      render(<BottomSheet {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('restores body scroll when closed', async () => {
      const { rerender } = render(<BottomSheet {...defaultProps} />);
      
      rerender(<BottomSheet {...defaultProps} isOpen={false} />);
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });

    it('supports custom className', () => {
      render(<BottomSheet {...defaultProps} className="custom-sheet" />);
      const sheet = document.querySelector('.bottom-sheet');
      expect(sheet).toHaveClass('custom-sheet');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<BottomSheet {...defaultProps} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Animation States', () => {
    it('handles opening animation', async () => {
      const { rerender } = render(<BottomSheet {...defaultProps} isOpen={false} />);
      
      rerender(<BottomSheet {...defaultProps} isOpen />);
      
      // Animation state should be handled internally
      await waitFor(() => {
        expect(screen.getByText('Bottom sheet content')).toBeInTheDocument();
      });
    });

    it('handles closing animation', async () => {
      const { rerender } = render(<BottomSheet {...defaultProps} />);
      
      rerender(<BottomSheet {...defaultProps} isOpen={false} />);
      
      // Should still be visible during animation
      expect(screen.getByText('Bottom sheet content')).toBeInTheDocument();
      
      // Should be removed after animation
      await waitFor(() => {
        expect(screen.queryByText('Bottom sheet content')).not.toBeInTheDocument();
      }, { timeout: 500 });
    });
  });
});

describe('BottomSheetHeader Component', () => {
  it('renders header content', () => {
    render(
      <BottomSheetHeader>
        <h2>Header Title</h2>
      </BottomSheetHeader>
    );
    
    expect(screen.getByText('Header Title')).toBeInTheDocument();
  });

  it('applies dark mode styles', () => {
    render(
      <BottomSheetHeader isDarkMode>
        <h2>Header Title</h2>
      </BottomSheetHeader>
    );
    
    const header = document.querySelector('.bottom-sheet-header');
    expect(header).toHaveAttribute('style');
  });

  it('supports custom className', () => {
    render(
      <BottomSheetHeader className="custom-header">
        <h2>Header Title</h2>
      </BottomSheetHeader>
    );
    
    const header = document.querySelector('.bottom-sheet-header');
    expect(header).toHaveClass('custom-header');
  });
});

describe('BottomSheetBody Component', () => {
  it('renders body content', () => {
    render(
      <BottomSheetBody>
        <p>Body content</p>
      </BottomSheetBody>
    );
    
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('supports custom className', () => {
    render(
      <BottomSheetBody className="custom-body">
        <p>Body content</p>
      </BottomSheetBody>
    );
    
    const body = document.querySelector('.bottom-sheet-body');
    expect(body).toHaveClass('custom-body');
  });
});

describe('BottomSheetFooter Component', () => {
  it('renders footer content', () => {
    render(
      <BottomSheetFooter>
        <button>Footer Button</button>
      </BottomSheetFooter>
    );
    
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  it('applies dark mode styles', () => {
    render(
      <BottomSheetFooter isDarkMode>
        <button>Footer Button</button>
      </BottomSheetFooter>
    );
    
    const footer = document.querySelector('.bottom-sheet-footer');
    expect(footer).toHaveAttribute('style');
  });

  it('supports custom className', () => {
    render(
      <BottomSheetFooter className="custom-footer">
        <button>Footer Button</button>
      </BottomSheetFooter>
    );
    
    const footer = document.querySelector('.bottom-sheet-footer');
    expect(footer).toHaveClass('custom-footer');
  });
});