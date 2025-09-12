'use client';
import React from 'react';
import { spacing, fontFamilies } from '../../../tokens';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { Text } from '../../atoms/Text/Text';
import { Icon } from '../../atoms/Icon/Icon';

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

const getSizeStyles = (size: PaginationSize) => {
  switch (size) {
    case 'sm':
      return {
        buttonSize: 'sm' as const,
        selectSize: 'sm' as const,
        textVariant: 'body-sm' as const,
        gap: spacing[1],
        containerPadding: spacing[2],
      };
    case 'md':
      return {
        buttonSize: 'md' as const,
        selectSize: 'md' as const,
        textVariant: 'body-md' as const,
        gap: spacing[2],
        containerPadding: spacing[3],
      };
    case 'lg':
      return {
        buttonSize: 'lg' as const,
        selectSize: 'lg' as const,
        textVariant: 'body-lg' as const,
        gap: spacing[3],
        containerPadding: spacing[4],
      };
    default:
      return {
        buttonSize: 'md' as const,
        selectSize: 'md' as const,
        textVariant: 'body-md' as const,
        gap: spacing[2],
        containerPadding: spacing[3],
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
    // theme variable removed - not used in current implementation
    const sizeStyles = getSizeStyles(size);
    
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

    const containerStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap' as const,
      gap: sizeStyles.gap,
      padding: sizeStyles.containerPadding,
      fontFamily: fontFamilies.sans,
    };

    const navigationStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: sizeStyles.gap,
      flex: 1,
      justifyContent: 'center',
    };

    const infoStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: sizeStyles.gap,
      minWidth: 'fit-content',
    };

    // Handle responsive design for mobile (simplified for testing)
    // Note: Mobile responsive styles would be implemented here if needed

    return (
      <Box
        ref={ref}
        className={className}
        style={containerStyles}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="navigation"
        aria-label="Pagination navigation"
        data-mond-pagination
      >
        {/* Items per page selector and info */}
        {(showItemsPerPage || showTotalInfo) && (
          <Box style={infoStyles}>
            {showItemsPerPage && onItemsPerPageChange && (
              <Box display="flex" alignItems="center" gap="4px">
                <Text 
                  variant={sizeStyles.textVariant} 
                  semantic="secondary" 
                  
                >
                  Show
                </Text>
                <Select
                  size={sizeStyles.selectSize}
                  value={itemsPerPage.toString()}
                  onChange={(value) => onItemsPerPageChange(parseInt(value, 10))}
                  options={itemsPerPageOptions.map(option => ({
                    value: option.toString(),
                    label: option.toString(),
                  }))}
                  
                />
                <Text 
                  variant={sizeStyles.textVariant} 
                  semantic="secondary" 
                  
                >
                  items
                </Text>
              </Box>
            )}
            
            {showTotalInfo && (
              <Text 
                variant={sizeStyles.textVariant} 
                semantic="secondary" 
                
              >
                {totalItems === 0 
                  ? 'No items'
                  : `${startItem}-${endItem} of ${totalItems} items`
                }
              </Text>
            )}
          </Box>
        )}

        {/* Navigation controls */}
        {totalPages > 1 && (
          <Box style={navigationStyles}>
            {/* Previous button */}
            <Button
              variant="outline"
              size={sizeStyles.buttonSize}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Go to previous page"
              
            >
              <Icon size="sm" decorative>
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </Icon>
            </Button>

            {/* First page button */}
            <Button
              variant="outline"
              size={sizeStyles.buttonSize}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(1)}
              aria-label="Go to first page"
              
            >
              <Icon size="sm" decorative>
                <path d="M11 6L5 12L11 18M17 6L11 12L17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </Icon>
            </Button>

            {/* Page numbers */}
            <Box 
              display="flex" 
              alignItems="center" 
              gap="4px"
            >
              {pageNumbers.map((page, index) => (
                page === 'ellipsis' ? (
                  <Box key={`ellipsis-${index}`} px="8px">
                    <Text 
                      variant={sizeStyles.textVariant} 
                      semantic="secondary" 
                      
                    >
                      ...
                    </Text>
                  </Box>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size={sizeStyles.buttonSize}
                    onClick={() => onPageChange(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                    
                  >
                    {page}
                  </Button>
                )
              ))}
            </Box>

            {/* Last page button */}
            <Button
              variant="outline"
              size={sizeStyles.buttonSize}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(totalPages)}
              aria-label="Go to last page"
              
            >
              <Icon size="sm" decorative>
                <path d="M13 6L19 12L13 18M7 6L13 12L7 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </Icon>
            </Button>

            {/* Next button */}
            <Button
              variant="outline"
              size={sizeStyles.buttonSize}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Go to next page"
              
            >
              <Icon size="sm" decorative>
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </Icon>
            </Button>
          </Box>
        )}
      </Box>
    );
  }
);

Pagination.displayName = 'Pagination';

export default Pagination;