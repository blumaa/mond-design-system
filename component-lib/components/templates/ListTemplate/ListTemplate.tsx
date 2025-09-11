'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '../../layout/Box/Box';
import { Card } from '../../layout/Card/Card';
import { Grid } from '../../layout/Grid/Grid';
import { Stack } from '../../layout/Stack/Stack';
import { Header } from '../../organisms/Header/Header';
import { Sidebar, SidebarSection } from '../../organisms/Sidebar/Sidebar';
import { SearchForm } from '../../molecules/SearchForm/SearchForm';
import { Pagination } from '../../organisms/Pagination/Pagination';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';
import { Badge } from '../../atoms/Badge/Badge';
import { Select } from '../../atoms/Select/Select';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { useTheme } from '../../../utils/theme';

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  tags?: string[];
  date?: Date;
  author?: string;
  status?: 'active' | 'inactive' | 'pending' | 'archived';
  metadata?: Record<string, unknown>;
}

export interface ListFilter {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'toggle';
  options?: { value: string; label: string; count?: number }[];
  value?: string | string[] | boolean;
}

export interface ListSort {
  value: string;
  label: string;
}

export interface ListViewConfig {
  id: string;
  label: string;
  icon?: string;
  columns?: 1 | 2 | 3 | 4;
}

export interface ListTemplateProps {
  /**
   * Template title
   * @default 'List'
   */
  title?: string;
  
  /**
   * Template description
   */
  description?: string;
  
  /**
   * List items to display
   */
  items: ListItem[];
  
  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Search functionality
   */
  searchEnabled?: boolean;
  
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  
  /**
   * Available filters
   */
  filters?: ListFilter[];
  
  /**
   * Available sort options
   */
  sortOptions?: ListSort[];
  
  /**
   * Available view configurations
   */
  viewOptions?: ListViewConfig[];
  
  /**
   * Pagination configuration
   */
  pagination?: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    showPageSize?: boolean;
  };
  
  /**
   * Empty state configuration
   */
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  
  /**
   * Whether to show the sidebar
   * @default false
   */
  showSidebar?: boolean;
  
  /**
   * Sidebar collapsed state
   * @default false
   */
  sidebarCollapsed?: boolean;
  
  /**
   * Navigation items for sidebar
   */
  navigationItems?: SidebarSection[];
  
  /**
   * Header actions
   */
  headerActions?: React.ReactNode;
  
  /**
   * Custom item renderer
   */
  renderItem?: (item: ListItem, viewMode: string) => React.ReactNode;
  
  /**
   * Search callback
   */
  onSearch?: (query: string) => void;
  
  /**
   * Filter change callback
   */
  onFilterChange?: (filterId: string, value: string | string[] | boolean) => void;
  
  /**
   * Sort change callback
   */
  onSortChange?: (sortValue: string) => void;
  
  /**
   * View mode change callback
   */
  onViewChange?: (viewId: string) => void;
  
  /**
   * Page change callback
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Page size change callback
   */
  onPageSizeChange?: (size: number) => void;
  
  /**
   * Item click callback
   */
  onItemClick?: (item: ListItem) => void;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Callback when navigation item is clicked
   */
  onNavigationClick?: (itemId: string) => void;
  
  /**
   * Callback when sidebar toggle is clicked
   */
  onSidebarToggle?: () => void;
  
  /**
   * Custom className
   */
  className?: string;
}

const defaultViewOptions: ListViewConfig[] = [
  { id: 'grid', label: 'Grid', icon: '▦', columns: 3 },
  { id: 'list', label: 'List', icon: '☰', columns: 1 },
  { id: 'card', label: 'Cards', icon: '▢', columns: 2 },
];

const defaultEmptyState: { title: string; description: string; action?: { label: string; onClick: () => void } } = {
  title: 'No items found',
  description: 'Try adjusting your search or filters to find what you\'re looking for.',
};

export const ListTemplate: React.FC<ListTemplateProps> = ({
  title = 'List',
  description,
  items = [],
  loading = false,
  searchEnabled = true,
  searchPlaceholder = 'Search items...',
  filters = [],
  sortOptions = [],
  viewOptions = defaultViewOptions,
  pagination,
  emptyState = defaultEmptyState,
  showSidebar = false,
  sidebarCollapsed = false,
  navigationItems,
  headerActions,
  renderItem,
  onSearch,
  onFilterChange,
  onSortChange,
  onViewChange,
  onPageChange,
  onPageSizeChange,
  onItemClick,
  isDarkMode = false,
  onNavigationClick,
  onSidebarToggle,
  className,
}) => {
  const theme = useTheme(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState(viewOptions[0]?.id || 'grid');
  const [activeSort, setActiveSort] = useState(sortOptions[0]?.value || '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string | number | boolean | string[]>>({});

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, value: string | number | boolean | string[]) => {
    setActiveFilters(prev => ({ ...prev, [filterId]: value }));
    // Convert number to string for onFilterChange callback
    const callbackValue = typeof value === 'number' ? value.toString() : value;
    onFilterChange?.(filterId, callbackValue as string | string[] | boolean);
  }, [onFilterChange]);

  // Handle sort changes
  const handleSortChange = useCallback((sortValue: string) => {
    setActiveSort(sortValue);
    onSortChange?.(sortValue);
  }, [onSortChange]);

  // Handle view changes
  const handleViewChange = useCallback((viewId: string) => {
    setActiveView(viewId);
    onViewChange?.(viewId);
  }, [onViewChange]);

  // Get current view configuration
  const currentView = useMemo(() => {
    return viewOptions.find(view => view.id === activeView) || viewOptions[0];
  }, [viewOptions, activeView]);

  // Format date helper
  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }, []);

  // Default item renderer
  const defaultRenderItem = useCallback((item: ListItem, viewMode: string) => {
    const isListView = viewMode === 'list';
    
    const itemContent = (
      <Stack spacing={isListView ? 8 : 12}>
        {/* Image */}
        {item.image && (
          <Box
            style={{
              width: '100%',
              height: isListView ? '60px' : '180px',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '6px',
              ...(isListView && {
                width: '80px',
                flexShrink: 0,
              }),
            }}
          />
        )}
        
        {/* Content */}
        <Stack spacing={8} style={{ flex: 1 }}>
          <Box>
            <Heading level={isListView ? 4 : 3} style={{ marginBottom: '4px' }}>
              {item.title}
            </Heading>
            {item.description && (
              <Text
                variant={isListView ? 'body-sm' : 'body-md'}
                semantic="secondary"
                isDarkMode={isDarkMode}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: isListView ? 2 : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </Text>
            )}
          </Box>
          
          {/* Metadata */}
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {item.category && (
              <Badge size="sm" variant="default" isDarkMode={isDarkMode}>
                {item.category}
              </Badge>
            )}
            {item.status && (
              <Badge
                size="sm"
                variant={
                  item.status === 'active' ? 'success' :
                  item.status === 'pending' ? 'warning' :
                  item.status === 'inactive' ? 'default' :
                  'default'
                }
                isDarkMode={isDarkMode}
              >
                {item.status}
              </Badge>
            )}
            {item.date && (
              <Text variant="caption" semantic="tertiary" isDarkMode={isDarkMode}>
                {formatDate(item.date)}
              </Text>
            )}
            {item.author && (
              <Text variant="caption" semantic="secondary" isDarkMode={isDarkMode}>
                by {item.author}
              </Text>
            )}
          </Box>
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <Box style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {item.tags.slice(0, isListView ? 2 : 4).map(tag => (
                <Badge key={tag} size="sm" variant="secondary" isDarkMode={isDarkMode}>
                  {tag}
                </Badge>
              ))}
              {item.tags.length > (isListView ? 2 : 4) && (
                <Badge size="sm" variant="secondary" isDarkMode={isDarkMode}>
                  +{item.tags.length - (isListView ? 2 : 4)}
                </Badge>
              )}
            </Box>
          )}
        </Stack>
      </Stack>
    );

    return (
      <Card
        key={item.id}
        padding={isListView ? 16 : 20}
        isDarkMode={isDarkMode}
        style={{
          cursor: onItemClick ? 'pointer' : 'default',
          transition: 'all 150ms ease',
          ...(onItemClick && {
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }),
          ...(isListView && {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }),
        }}
        onClick={() => onItemClick?.(item)}
      >
        {isListView ? (
          <Box style={{ display: 'flex', gap: '16px', width: '100%' }}>
            {itemContent}
          </Box>
        ) : (
          itemContent
        )}
      </Card>
    );
  }, [isDarkMode, formatDate, onItemClick]);

  // Render filters
  const renderFilters = () => {
    if (!filters.length) return null;

    return (
      <Card padding={20} isDarkMode={isDarkMode}>
        <Stack spacing={16}>
          <Heading level={4}>Filters</Heading>
          {filters.map(filter => (
            <Box key={filter.id}>
              <Text
                variant="body-sm"
                semantic="primary"
                isDarkMode={isDarkMode}
                style={{ fontWeight: 'medium', marginBottom: '8px' }}
              >
                {filter.label}
              </Text>
              {filter.type === 'select' && filter.options && (
                <Select
                  value={String(activeFilters[filter.id] || '')}
                  onChange={(value) => handleFilterChange(filter.id, value)}
                  options={[
                    { value: '', label: 'All' },
                    ...filter.options.map(opt => ({
                      value: opt.value,
                      label: opt.count ? `${opt.label} (${opt.count})` : opt.label,
                    }))
                  ]}
                  isDarkMode={isDarkMode}
                  placeholder="Select..."
                />
              )}
            </Box>
          ))}
        </Stack>
      </Card>
    );
  };

  // Render toolbar
  const renderToolbar = () => (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {/* Left side - Search */}
      <Box style={{ flex: 1, maxWidth: '400px' }}>
        {searchEnabled && (
          <SearchForm
            placeholder={searchPlaceholder}
            onSearch={handleSearch}
            value={searchQuery}
            loading={loading}
            isDarkMode={isDarkMode}
          />
        )}
      </Box>

      {/* Right side - Controls */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Sort */}
        {sortOptions.length > 0 && (
          <Select
            value={activeSort}
            onChange={handleSortChange}
            options={sortOptions}
            isDarkMode={isDarkMode}
            placeholder="Sort by..."
          />
        )}

        {/* View options */}
        {viewOptions.length > 1 && (
          <Box style={{ display: 'flex', gap: '4px' }}>
            {viewOptions.map(view => (
              <Button
                key={view.id}
                variant={activeView === view.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleViewChange(view.id)}
                isDarkMode={isDarkMode}
                aria-label={view.label}
              >
                {view.icon}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  // Render items
  const renderItems = () => {
    if (loading) {
      return (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 16px',
          }}
        >
          <Stack spacing={16} align="center">
            <Spinner size="lg" isDarkMode={isDarkMode} />
            <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
              Loading items...
            </Text>
          </Stack>
        </Box>
      );
    }

    if (items.length === 0) {
      return (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 16px',
          }}
        >
          <Stack spacing={16} align="center">
            <Text
              variant="body-lg"
              semantic="tertiary"
              isDarkMode={isDarkMode}
              style={{ fontSize: '48px' }}
            >
              📭
            </Text>
            <Stack spacing={8} align="center">
              <Heading level={3} style={{ textAlign: 'center' }}>
                {emptyState.title}
              </Heading>
              <Text
                variant="body-lg"
                semantic="secondary"
                isDarkMode={isDarkMode}
                style={{ textAlign: 'center', maxWidth: '400px' }}
              >
                {emptyState.description}
              </Text>
            </Stack>
            {emptyState.action && (
              <Button
                onClick={emptyState.action.onClick}
                isDarkMode={isDarkMode}
              >
                {emptyState.action.label}
              </Button>
            )}
          </Stack>
        </Box>
      );
    }

    const itemRenderer = renderItem || defaultRenderItem;

    return (
      <Grid
        columns={currentView?.columns || 1}
        gap={16}
      >
        {items.map(item => itemRenderer(item, activeView))}
      </Grid>
    );
  };

  return (
    <Box
      className={className}
      style={{
        minHeight: '100vh',
        backgroundColor: theme('surface.primary'),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Header
        title={title}
        rightContent={headerActions}
        isDarkMode={isDarkMode}
        onMobileMenuToggle={onSidebarToggle}
      />

      {/* Main Content */}
      <Box style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        {showSidebar && navigationItems && (
          <Sidebar
            sections={navigationItems}
            collapsed={sidebarCollapsed}
            isDarkMode={isDarkMode}
            onItemClick={(item) => onNavigationClick?.(item.id)}
          />
        )}

        {/* Content Area */}
        <Box style={{ flex: 1 }}>
          <Box style={{ display: 'flex', gap: '24px', padding: '24px' }}>
            {/* Filters Sidebar */}
            {filters.length > 0 && (
              <Box style={{ width: '280px', flexShrink: 0 }}>
                {renderFilters()}
              </Box>
            )}

            {/* Main Content */}
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Stack spacing={24}>
                {/* Page Header */}
                <Box>
                  <Heading level={2} style={{ marginBottom: '8px' }}>
                    {title}
                  </Heading>
                  {description && (
                    <Text variant="body-lg" semantic="secondary" isDarkMode={isDarkMode}>
                      {description}
                    </Text>
                  )}
                </Box>

                {/* Toolbar */}
                {renderToolbar()}

                {/* Items */}
                {renderItems()}

                {/* Pagination */}
                {pagination && items.length > 0 && (
                  <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      onPageChange={onPageChange || (() => {})}
                      onItemsPerPageChange={pagination.showPageSize ? onPageSizeChange : undefined}
                      isDarkMode={isDarkMode}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ListTemplate;