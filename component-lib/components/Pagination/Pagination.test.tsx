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
    it('renders pagination with navigation and info', () => {
      render(<Pagination {...defaultProps} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Pagination navigation')).toBeInTheDocument();
      expect(screen.getByText('1-10 of 100 items')).toBeInTheDocument();
    });

    it('calculates total pages correctly', () => {
      render(<Pagination {...defaultProps} totalItems={95} itemsPerPage={10} />);
      expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument();
    });
  });

  describe('Page navigation', () => {
    it('calls onPageChange when navigating', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      fireEvent.click(screen.getByLabelText('Go to page 2'));
      expect(onPageChange).toHaveBeenCalledWith(2);

      fireEvent.click(screen.getByLabelText('Go to next page'));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables prev/next buttons at boundaries', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
      expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    });
  });

  describe('Keyboard navigation', () => {
    it('handles arrow keys for navigation', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(onPageChange).toHaveBeenCalledWith(2);

      fireEvent.keyDown(container, { key: 'ArrowRight' });
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('does not navigate beyond boundaries', () => {
      const onPageChange = jest.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);

      const container = screen.getByRole('navigation');
      fireEvent.keyDown(container, { key: 'ArrowLeft' });
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Items per page functionality', () => {
    it('handles items per page selector', () => {
      const onItemsPerPageChange = jest.fn();
      render(<Pagination {...defaultProps} onItemsPerPageChange={onItemsPerPageChange} />);

      expect(screen.getByText('Show')).toBeInTheDocument();
      expect(screen.getByText('items')).toBeInTheDocument();
    });

    it('hides selector when showItemsPerPage is false', () => {
      render(<Pagination {...defaultProps} showItemsPerPage={false} />);
      expect(screen.queryByText('Show')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles single page scenario', () => {
      render(<Pagination {...defaultProps} totalItems={5} itemsPerPage={10} />);
      expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
    });

    it('handles zero items', () => {
      render(<Pagination {...defaultProps} totalItems={0} />);
      expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('handles partial last page correctly', () => {
      render(<Pagination {...defaultProps} totalItems={95} currentPage={10} />);
      expect(screen.getByText('91-95 of 95 items')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and keyboard support', () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      expect(screen.getByLabelText('Pagination navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();

      const currentButton = screen.getByLabelText('Go to page 3');
      expect(currentButton).toHaveAttribute('aria-current', 'page');

      const container = screen.getByRole('navigation');
      expect(container).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Component integration', () => {
    it('forwards ref and applies custom className', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Pagination {...defaultProps} ref={ref} className="custom-pagination" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      const container = screen.getByRole('navigation');
      expect(container).toHaveClass('custom-pagination');
      expect(container).toHaveAttribute('data-mond-pagination');
    });
  });
});
