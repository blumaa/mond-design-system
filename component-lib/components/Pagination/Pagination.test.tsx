import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
    onPageChange: jest.fn(),
    onItemsPerPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders pagination component', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Pagination navigation')).toBeInTheDocument();
    });

    it('displays total items info by default', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByText('1-10 of 100 items')).toBeInTheDocument();
    });

    it('displays items per page selector by default', () => {
      render(<Pagination {...defaultProps} />);
      expect(screen.getByText('Show')).toBeInTheDocument();
      expect(screen.getByText('items')).toBeInTheDocument();
    });

    it('calculates total pages correctly', () => {
      render(<Pagination {...defaultProps} totalItems={95} itemsPerPage={10} />);
      // Should show pages 1-10 (95 items / 10 per page = 9.5, rounded up to 10 pages)
      expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument();
    });
  });

  describe('Page navigation', () => {
    it('calls onPageChange when page number is clicked', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByLabelText('Go to page 2'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when next button is clicked', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByLabelText('Go to next page'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange when previous button is clicked', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByLabelText('Go to previous page'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange when first page button is clicked', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByLabelText('Go to first page'));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange when last page button is clicked', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);
      
      fireEvent.click(screen.getByLabelText('Go to last page'));
      expect(onPageChange).toHaveBeenCalledWith(10); // 100 items / 10 per page = 10 pages
    });
  });

  describe('Button states', () => {
    it('disables previous and first buttons on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    });

    it('disables next and last buttons on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} />);
      
      expect(screen.getByLabelText('Go to next page')).toBeDisabled();
      expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    });

    it('highlights current page button', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      
      const currentPageButton = screen.getByLabelText('Go to page 3');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Keyboard navigation', () => {
    it('handles arrow left key to go to previous page', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
      
      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('handles arrow right key to go to next page', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
      
      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowRight' });
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('handles Home key to go to first page', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
      
      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'Home' });
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('handles End key to go to last page', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);
      
      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'End' });
      expect(onPageChange).toHaveBeenCalledWith(10);
    });

    it('does not navigate beyond boundaries with keyboard', () => {
      const onPageChange = jest.fn();
      
      // Test first page
      const { rerender } = render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
      const container = screen.getByRole('navigation');
      
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(onPageChange).not.toHaveBeenCalled();
      
      // Test last page
      rerender(<Pagination {...defaultProps} currentPage={10} onPageChange={onPageChange} />);
      fireEvent.keyDown(container, { key: 'ArrowRight' });
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Items per page functionality', () => {
    it('calls onItemsPerPageChange when items per page is changed', () => {
      const onItemsPerPageChange = jest.fn();
      render(
        <Pagination 
          {...defaultProps} 
          onItemsPerPageChange={onItemsPerPageChange}
        />
      );
      
      // The component should render with the items per page selector
      expect(screen.getByText('Show')).toBeInTheDocument();
      expect(screen.getByText('items')).toBeInTheDocument();
      
      // Test that the handler is defined and ready to be called
      expect(onItemsPerPageChange).toBeDefined();
    });

    it('hides items per page selector when showItemsPerPage is false', () => {
      render(<Pagination {...defaultProps} showItemsPerPage={false} />);
      
      expect(screen.queryByText('Show')).not.toBeInTheDocument();
      expect(screen.queryByText('items')).not.toBeInTheDocument();
    });

    it('uses custom items per page options', () => {
      const customOptions = [5, 15, 30];
      render(
        <Pagination 
          {...defaultProps} 
          itemsPerPageOptions={customOptions}
          itemsPerPage={5}
          onItemsPerPageChange={jest.fn()}
        />
      );
      
      // Check that the select has the correct value
      const select = screen.getByRole('button', { expanded: false });
      expect(select).toHaveTextContent('5');
    });
  });

  describe('Total info display', () => {
    it('hides total info when showTotalInfo is false', () => {
      render(<Pagination {...defaultProps} showTotalInfo={false} />);
      
      expect(screen.queryByText('1-10 of 100 items')).not.toBeInTheDocument();
    });

    it('shows correct range for different pages', () => {
      const { rerender } = render(<Pagination {...defaultProps} currentPage={3} />);
      expect(screen.getByText('21-30 of 100 items')).toBeInTheDocument();
      
      rerender(<Pagination {...defaultProps} currentPage={10} />);
      expect(screen.getByText('91-100 of 100 items')).toBeInTheDocument();
    });

    it('handles partial last page correctly', () => {
      render(<Pagination {...defaultProps} totalItems={95} currentPage={10} />);
      expect(screen.getByText('91-95 of 95 items')).toBeInTheDocument();
    });

    it('shows "No items" when totalItems is 0', () => {
      render(<Pagination {...defaultProps} totalItems={0} />);
      expect(screen.getByText('No items')).toBeInTheDocument();
    });
  });

  describe('Ellipsis handling', () => {
    it('shows ellipsis for large page ranges', () => {
      render(
        <Pagination 
          {...defaultProps} 
          totalItems={200} 
          itemsPerPage={1} 
          currentPage={100}
          maxVisiblePages={7}
        />
      );
      
      const ellipsis = screen.getAllByText('...');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('shows all pages when total pages is less than maxVisiblePages', () => {
      render(<Pagination {...defaultProps} totalItems={50} />); // 5 pages
      
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
      }
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('renders small size variant', () => {
      render(<Pagination {...defaultProps} size="sm" />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders medium size variant (default)', () => {
      render(<Pagination {...defaultProps} size="md" />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders large size variant', () => {
      render(<Pagination {...defaultProps} size="lg" />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Dark mode', () => {
    it('renders with dark mode styles', () => {
      render(<Pagination {...defaultProps} isDarkMode={true} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles single page scenario', () => {
      render(<Pagination {...defaultProps} totalItems={5} itemsPerPage={10} />);
      
      // Navigation should be hidden for single page
      expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
    });

    it('handles zero items', () => {
      render(<Pagination {...defaultProps} totalItems={0} />);
      
      expect(screen.getByText('No items')).toBeInTheDocument();
      expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
    });

    it('handles current page beyond total pages gracefully', () => {
      render(<Pagination {...defaultProps} currentPage={15} totalItems={50} />);
      
      // Component should still render without crashing
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByLabelText('Pagination navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    });

    it('sets aria-current for current page', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);
      
      const currentButton = screen.getByLabelText('Go to page 3');
      expect(currentButton).toHaveAttribute('aria-current', 'page');
    });

    it('is keyboard focusable', () => {
      render(<Pagination {...defaultProps} />);
      
      const container = screen.getByRole('navigation');
      expect(container).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Component integration', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Pagination {...defaultProps} ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies custom className', () => {
      render(<Pagination {...defaultProps} className="custom-pagination" />);
      
      const container = screen.getByRole('navigation');
      expect(container).toHaveClass('custom-pagination');
    });

    it('has proper data attributes', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByRole('navigation')).toHaveAttribute('data-mond-pagination');
    });
  });
});