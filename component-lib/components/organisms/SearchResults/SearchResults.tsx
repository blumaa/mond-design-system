'use client';
import React, { useState, useMemo } from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../../tokens';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Text } from '../../atoms/Text/Text';
import { Badge } from '../../atoms/Badge/Badge';
import { Pagination } from '../Pagination/Pagination';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url?: string;
  category?: string;
  tags?: string[];
  image?: string;
  date?: Date;
  author?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: { value: string; label: string; count?: number }[];
  value?: unknown;
}

export interface SearchResultsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'results'> {
  /**
   * Search results to display
   */
  results: SearchResult[];
  
  /**
   * Current search query
   */
  query?: string;
  
  /**
   * Available filters
   */
  filters?: SearchFilter[];
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Total number of results (for pagination)
   */
  totalResults?: number;
  
  /**
   * Current page number
   * @default 1
   */
  currentPage?: number;
  
  /**
   * Results per page
   * @default 10
   */
  resultsPerPage?: number;
  
  /**
   * Sort options
   */
  sortOptions?: { value: string; label: string }[];
  
  /**
   * Current sort value
   */
  sortBy?: string;
  
  /**
   * View mode (list or grid)
   * @default 'list'
   */
  viewMode?: 'list' | 'grid';
  
  /**
   * Whether to show result count
   * @default true
   */
  showResultCount?: boolean;
  
  /**
   * Whether to show filters sidebar
   * @default true
   */
  showFilters?: boolean;
  
  /**
   * Whether to show search controls
   * @default true
   */
  showControls?: boolean;
  
  /**
   * Custom result item renderer
   */
  renderResult?: (result: SearchResult, index: number) => React.ReactNode;
  
  /**
   * Callback when search query changes
   */
  onSearch?: (query: string) => void;
  
  /**
   * Callback when filter changes
   */
  onFilterChange?: (filterId: string, value: unknown) => void;
  
  /**
   * Callback when sort changes
   */
  onSortChange?: (sortBy: string) => void;
  
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Callback when view mode changes
   */
  onViewModeChange?: (viewMode: 'list' | 'grid') => void;
  
  /**
   * Callback when result is clicked
   */
  onResultClick?: (result: SearchResult) => void;
  
  /**
   * Dark mode
   * @default false
   */
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results = [],
  query = '',
  filters = [],
  loading = false,
  totalResults,
  currentPage = 1,
  resultsPerPage = 10,
  sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
  ],
  sortBy = 'relevance',
  viewMode = 'list',
  showResultCount = true,
  showFilters = true,
  showControls = true,
  renderResult,
  onSearch,
  onFilterChange,
  onSortChange,
  onPageChange,
  onViewModeChange,
  onResultClick,
  
  className,
  ...props
}) => {
  const { theme: getColor } = useThemeContext();
  const [localQuery, setLocalQuery] = useState(query);
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>({});

  const effectiveTotal = totalResults ?? results.length;
  const totalPages = Math.ceil(effectiveTotal / resultsPerPage);

  const handleSearch = (newQuery: string) => {
    setLocalQuery(newQuery);
    onSearch?.(newQuery);
  };

  const handleFilterChange = (filterId: string, value: unknown) => {
    setActiveFilters(prev => ({ ...prev, [filterId]: value }));
    onFilterChange?.(filterId, value);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter(value => 
      value !== undefined && value !== null && value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }, [activeFilters]);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
    width: '100%',
    fontFamily: fontFamilies.sans,
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const searchBarStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing[3],
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const controlsStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[3],
  };

  const leftControlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
  };

  const rightControlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing[6],
  };

  const filtersStyles: React.CSSProperties = {
    width: '240px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const filterGroupStyles: React.CSSProperties = {
    padding: spacing[4],
    border: `1px solid ${getColor('border.primary')}`,
    borderRadius: radii.md,
    backgroundColor: getColor('surface.secondary'),
  };

  const filterHeaderStyles: React.CSSProperties = {
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sm,
    marginBottom: spacing[3],
    color: getColor('text.primary'),
  };

  const resultsContainerStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const resultsGridStyles: React.CSSProperties = {
    display: viewMode === 'grid' ? 'grid' : 'flex',
    flexDirection: viewMode === 'list' ? 'column' : undefined,
    gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
    gap: spacing[4],
  };

  const resultItemStyles: React.CSSProperties = {
    padding: spacing[4],
    border: `1px solid ${getColor('border.primary')}`,
    borderRadius: radii.md,
    backgroundColor: getColor('surface.primary'),
    cursor: onResultClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
  };

  const resultItemHoverStyles: React.CSSProperties = {
    borderColor: getColor('border.accent'),
    backgroundColor: getColor('surface.secondary'),
  };

  const resultTitleStyles: React.CSSProperties = {
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.lg,
    marginBottom: spacing[2],
    color: getColor('text.primary'),
    textDecoration: 'none',
  };

  const resultDescriptionStyles: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: getColor('text.secondary'),
    lineHeight: '1.5',
    marginBottom: spacing[3],
  };

  const resultMetaStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: fontSizes.xs,
    color: getColor('text.tertiary'),
  };

  const loadingStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
    color: getColor('text.secondary'),
  };

  const emptyStateStyles: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing[8],
    color: getColor('text.secondary'),
  };

  const renderDefaultResult = (result: SearchResult, _index: number) => (
    <Box
      key={result.id}
      style={resultItemStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, resultItemHoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, resultItemStyles);
      }}
      onClick={() => onResultClick?.(result)}
    >
      <Box style={resultTitleStyles}>
        {result.url ? (
          <a href={result.url} style={{ color: 'inherit', textDecoration: 'none' }}>
            {result.title}
          </a>
        ) : (
          result.title
        )}
      </Box>
      
      {result.description && (
        <Box style={resultDescriptionStyles}>
          {result.description}
        </Box>
      )}
      
      <Box style={resultMetaStyles}>
        {result.category && (
          <Badge variant="default" size="sm" >
            {result.category}
          </Badge>
        )}
        
        {result.author && (
          <Text variant="caption" semantic="tertiary" >
            by {result.author}
          </Text>
        )}
        
        {result.date && (
          <Text variant="caption" semantic="tertiary" >
            {result.date.toLocaleDateString()}
          </Text>
        )}
      </Box>
      
      {result.tags && result.tags.length > 0 && (
        <Box style={{ display: 'flex', gap: spacing[1], marginTop: spacing[2], flexWrap: 'wrap' }}>
          {result.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm" >
              {tag}
            </Badge>
          ))}
          {result.tags.length > 3 && (
            <Badge variant="secondary" size="sm" >
              +{result.tags.length - 3}
            </Badge>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <Box className={className} style={containerStyles} {...props}>
      {showControls && (
        <Box style={headerStyles}>
          {/* Search Bar */}
          <Box style={searchBarStyles}>
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(localQuery)}
              placeholder="Search..."
              style={{ flex: 1, minWidth: '300px' }}
              
            />
            <Button
              variant="primary"
              onClick={() => handleSearch(localQuery)}
              disabled={loading}
              
            >
              Search
            </Button>
          </Box>
          
          {/* Controls */}
          <Box style={controlsStyles}>
            <Box style={leftControlsStyles}>
              {showResultCount && (
                <Text variant="body-sm" semantic="secondary" >
                  {loading ? 'Searching...' : `${effectiveTotal.toLocaleString()} results`}
                  {query && ` for "${query}"`}
                </Text>
              )}
              
              {activeFilterCount > 0 && (
                <Badge variant="primary" >
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                </Badge>
              )}
            </Box>
            
            <Box style={rightControlsStyles}>
              {sortOptions.length > 0 && (
                <Box style={{ minWidth: '140px' }}>
                  <Select
                    size="md"
                    value={sortBy}
                    onChange={(value) => onSortChange?.(value)}
                    options={sortOptions}
                    
                  />
                </Box>
              )}
              
              <Box style={{ display: 'flex', gap: spacing[1] }}>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange?.('list')}
                  
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onViewModeChange?.('grid')}
                  
                >
                  Grid
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      
      <Box style={contentStyles}>
        {/* Filters Sidebar */}
        {showFilters && filters.length > 0 && (
          <Box style={filtersStyles}>
            <Text variant="body-lg" semantic="primary" >
              Filters
            </Text>
            
            {filters.map((filter) => (
              <Box key={filter.id} style={filterGroupStyles}>
                <Box style={filterHeaderStyles}>{filter.label}</Box>
                
                {filter.type === 'select' && filter.options && (
                  <Select
                    size="md"
                    value={String(activeFilters[filter.id] || '')}
                    onChange={(value) => handleFilterChange(filter.id, value)}
                    placeholder="All"
                    options={[
                      { value: '', label: 'All' },
                      ...filter.options.map(option => ({
                        value: option.value,
                        label: `${option.label}${option.count !== undefined ? ` (${option.count})` : ''}`,
                      }))
                    ]}
                    
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
        
        {/* Results */}
        <Box style={resultsContainerStyles}>
          {loading ? (
            <Box style={loadingStyles}>
              <Text variant="body-lg" semantic="secondary" >
                Loading results...
              </Text>
            </Box>
          ) : results.length === 0 ? (
            <Box style={emptyStateStyles}>
              <Text variant="body-lg" semantic="secondary" >
                No results found
              </Text>
              <Text variant="body-md" semantic="tertiary" >
                Try adjusting your search terms or filters
              </Text>
            </Box>
          ) : (
            <>
              <Box style={resultsGridStyles}>
                {results.map((result, index) => 
                  renderResult ? renderResult(result, index) : renderDefaultResult(result, index)
                )}
              </Box>
              
              {/* Pagination */}
              {totalPages > 1 && onPageChange && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={effectiveTotal}
                  itemsPerPage={resultsPerPage}
                  onPageChange={onPageChange}
                  
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};