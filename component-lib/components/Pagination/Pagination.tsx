import React from 'react';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import './pagination.css';

export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps {
  /**
   * Current active page (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Items shown per page
   */
  itemsPerPage: number;

  /**
   * Page change handler
   */
  onPageChange: (page: number) => void;

  /**
   * Items per page change handler
   */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /**
   * Available items per page options
   * @default [10, 25, 50, 100]
   */
  itemsPerPageOptions?: number[];

  /**
   * Max page numbers to show before ellipsis
   * @default 7
   */
  maxVisiblePages?: number;

  /**
   * Show items per page selector
   * @default true
   */
  showItemsPerPage?: boolean;

  /**
   * Show "X-Y of Z items" info
   * @default true
   */
  showTotalInfo?: boolean;

  /**
   * Size variant
   * @default 'md'
   */
  size?: PaginationSize;

  /**
   * Dark mode support
   * @default false
   */

  /**
   * Custom className
   */
  className?: string;
}

const getSizeConfig = (size: PaginationSize) => {
  switch (size) {
    case 'sm':
      return {
        buttonSize: 'sm' as const,
        selectSize: 'sm' as const,
        textSize: 'sm' as const,
      };
    case 'md':
      return {
        buttonSize: 'md' as const,
        selectSize: 'md' as const,
        textSize: 'md' as const,
      };
    case 'lg':
      return {
        buttonSize: 'lg' as const,
        selectSize: 'lg' as const,
        textSize: 'md' as const,
      };
    default:
      return {
        buttonSize: 'md' as const,
        selectSize: 'md' as const,
        textSize: 'md' as const,
      };
  }
};

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100],
    maxVisiblePages = 7,
    showItemsPerPage = true,
    showTotalInfo = true,
    size = 'md',
    
    className,
  }, ref) => {
    const sizeConfig = getSizeConfig(size);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers with ellipsis
    const generatePageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is within max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always show first page
        pages.push(1);
        
        const startPage = Math.max(2, currentPage - Math.floor((maxVisiblePages - 3) / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 4);
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
          pages.push('ellipsis');
        }
        
        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    const pageNumbers = generatePageNumbers();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          onPageChange(1);
          break;
        case 'End':
          event.preventDefault();
          onPageChange(totalPages);
          break;
      }
    };

    const containerClassName = `mond-pagination mond-pagination--${size} ${className || ''}`.trim();

    return (
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
      <div
        ref={ref}
        className={containerClassName}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="navigation"
        aria-label="Pagination navigation"
        data-mond-pagination
      >
      {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        {/* Items per page selector and info */}
        {(showItemsPerPage || showTotalInfo) && (
          <div className="mond-pagination__info">
            {showItemsPerPage && onItemsPerPageChange && (
              <div className="mond-pagination__items-per-page">
                <Text
                  size={sizeConfig.textSize}
                  semantic="secondary"
                >
                  Show
                </Text>
                <Select
                  size={sizeConfig.selectSize}
                  value={itemsPerPage.toString()}
                  onChange={(value) => onItemsPerPageChange(parseInt(value, 10))}
                  options={itemsPerPageOptions.map(option => ({
                    value: option.toString(),
                    label: option.toString(),
                  }))}
                />
                <Text
                  size={sizeConfig.textSize}
                  semantic="secondary"
                >
                  items
                </Text>
              </div>
            )}

            {showTotalInfo && (
              <Text
                size={sizeConfig.textSize}
                semantic="secondary"
              >
                {totalItems === 0
                  ? 'No items'
                  : `${startItem}-${endItem} of ${totalItems} items`
                }
              </Text>
            )}
          </div>
        )}

        {/* Navigation controls */}
        {totalPages > 1 && (
          <div className="mond-pagination__navigation">
            {/* Previous button */}
            <Button
              variant="outline"
              size={sizeConfig.buttonSize}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Go to previous page"
            >
              <Icon size="sm" decorative>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
            </Button>

            {/* First page button */}
            <Button
              variant="outline"
              size={sizeConfig.buttonSize}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(1)}
              aria-label="Go to first page"
            >
              <Icon size="sm" decorative>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M11 6L5 12L11 18M17 6L11 12L17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
            </Button>

            {/* Page numbers */}
            <div className="mond-pagination__pages">
              {pageNumbers.map((page, index) => (
                page === 'ellipsis' ? (
                  <div key={`ellipsis-${index}`} className="mond-pagination__ellipsis">
                    <Text
                      size={sizeConfig.textSize}
                      semantic="secondary"
                    >
                      ...
                    </Text>
                  </div>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size={sizeConfig.buttonSize}
                    onClick={() => onPageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>

            {/* Last page button */}
            <Button
              variant="outline"
              size={sizeConfig.buttonSize}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(totalPages)}
              aria-label="Go to last page"
            >
              <Icon size="sm" decorative>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M13 6L19 12L13 18M7 6L13 12L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
            </Button>

            {/* Next button */}
            <Button
              variant="outline"
              size={sizeConfig.buttonSize}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Go to next page"
            >
              <Icon size="sm" decorative>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Icon>
            </Button>
          </div>
        )}
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

export default Pagination;