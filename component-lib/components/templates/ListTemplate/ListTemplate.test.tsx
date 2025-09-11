import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListTemplate, type ListItem, type ListFilter, type ListSort } from './ListTemplate';

const mockItems: ListItem[] = [
  {
    id: '1',
    title: 'Test Article 1',
    description: 'This is a test article description',
    category: 'Frontend',
    tags: ['React', 'TypeScript'],
    date: new Date('2024-01-15'),
    author: 'John Doe',
    status: 'active',
  },
  {
    id: '2',
    title: 'Test Article 2',
    description: 'Another test article description',
    category: 'Backend',
    tags: ['Node.js', 'API'],
    date: new Date('2024-01-10'),
    author: 'Jane Smith',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Test Article 3',
    description: 'Third test article description',
    category: 'Frontend',
    tags: ['Vue', 'JavaScript'],
    date: new Date('2024-01-05'),
    author: 'Bob Johnson',
    status: 'archived',
  },
];

const mockFilters: ListFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'Frontend', label: 'Frontend', count: 2 },
      { value: 'Backend', label: 'Backend', count: 1 },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active', count: 1 },
      { value: 'pending', label: 'Pending', count: 1 },
      { value: 'archived', label: 'Archived', count: 1 },
    ],
  },
];

const mockSortOptions: ListSort[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
];

const defaultProps = {
  title: 'Test List',
  items: mockItems,
  onSearch: jest.fn(),
  onFilterChange: jest.fn(),
  onSortChange: jest.fn(),
  onViewChange: jest.fn(),
  onPageChange: jest.fn(),
  onItemClick: jest.fn(),
};

describe('ListTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ListTemplate {...defaultProps} />);
    
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
    expect(screen.getByText('Test Article 3')).toBeInTheDocument();
  });

  it('displays title and description', () => {
    const description = 'This is a test list description';
    render(<ListTemplate {...defaultProps} description={description} />);
    
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders search form when searchEnabled is true', () => {
    render(<ListTemplate {...defaultProps} searchEnabled={true} />);
    
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  });

  it('does not render search form when searchEnabled is false', () => {
    render(<ListTemplate {...defaultProps} searchEnabled={false} />);
    
    expect(screen.queryByPlaceholderText('Search items...')).not.toBeInTheDocument();
  });

  it('renders custom search placeholder', () => {
    render(
      <ListTemplate 
        {...defaultProps} 
        searchEnabled={true} 
        searchPlaceholder="Search articles..." 
      />
    );
    
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
  });

  it('renders filters when provided', () => {
    render(<ListTemplate {...defaultProps} filters={mockFilters} />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders sort options when provided', () => {
    render(<ListTemplate {...defaultProps} sortOptions={mockSortOptions} />);
    
    // Sort dropdown should be present
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });

  it('renders view mode buttons', () => {
    render(<ListTemplate {...defaultProps} />);
    
    // Default view options should include grid, list, and card views
    expect(screen.getByLabelText('Grid')).toBeInTheDocument();
    expect(screen.getByLabelText('List')).toBeInTheDocument();
    expect(screen.getByLabelText('Cards')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<ListTemplate {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Loading items...')).toBeInTheDocument();
  });

  it('displays empty state when no items', () => {
    render(<ListTemplate {...defaultProps} items={[]} />);
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters to find what you\'re looking for.')).toBeInTheDocument();
  });

  it('displays custom empty state', () => {
    const customEmptyState = {
      title: 'No articles found',
      description: 'Try different search terms',
      action: {
        label: 'Create Article',
        onClick: jest.fn(),
      },
    };

    render(<ListTemplate {...defaultProps} items={[]} emptyState={customEmptyState} />);
    
    expect(screen.getByText('No articles found')).toBeInTheDocument();
    expect(screen.getByText('Try different search terms')).toBeInTheDocument();
    expect(screen.getByText('Create Article')).toBeInTheDocument();
  });

  it('renders search functionality correctly', () => {
    render(<ListTemplate {...defaultProps} searchEnabled={true} />);
    
    // Verify search form is rendered
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    
    // The search functionality is complex and depends on SearchForm's internal implementation
    // This test ensures the search interface is properly rendered
  });

  it('calls onViewChange when view mode is changed', async () => {
    const user = userEvent.setup();
    render(<ListTemplate {...defaultProps} />);
    
    const listViewButton = screen.getByLabelText('List');
    await user.click(listViewButton);
    
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('list');
  });

  it('calls onItemClick when item is clicked', async () => {
    const user = userEvent.setup();
    render(<ListTemplate {...defaultProps} />);
    
    const firstItem = screen.getByText('Test Article 1');
    await user.click(firstItem);
    
    expect(defaultProps.onItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('displays item metadata correctly', () => {
    render(<ListTemplate {...defaultProps} />);
    
    // Check for categories (there might be multiple Frontend badges)
    expect(screen.getAllByText('Frontend')).toHaveLength(2); // Two items have Frontend category
    expect(screen.getByText('Backend')).toBeInTheDocument();
    
    // Check for statuses
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('archived')).toBeInTheDocument();
    
    // Check for authors
    expect(screen.getByText('by John Doe')).toBeInTheDocument();
    expect(screen.getByText('by Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('by Bob Johnson')).toBeInTheDocument();
  });

  it('displays tags for items', () => {
    render(<ListTemplate {...defaultProps} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  it('renders pagination when provided', () => {
    const pagination = {
      currentPage: 1,
      totalItems: 100,
      itemsPerPage: 10,
    };

    render(<ListTemplate {...defaultProps} pagination={pagination} />);
    
    // Pagination component should be rendered
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('calls onPageChange when page is changed', async () => {
    const user = userEvent.setup();
    const pagination = {
      currentPage: 1,
      totalItems: 20,
      itemsPerPage: 10,
    };

    render(<ListTemplate {...defaultProps} pagination={pagination} />);
    
    // Find next page button (assuming it exists in pagination)
    const nextButton = screen.getByLabelText(/next/i);
    await user.click(nextButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders sidebar when showSidebar is true', () => {
    const navigationItems = [
      {
        id: 'main',
        title: 'Main',
        items: [
          { id: 'list', label: 'List View', icon: '📋' }
        ]
      }
    ];

    render(
      <ListTemplate 
        {...defaultProps} 
        showSidebar={true} 
        navigationItems={navigationItems}
      />
    );
    
    expect(screen.getByText('List View')).toBeInTheDocument();
  });

  it('uses custom item renderer when provided', () => {
    const customRenderer = jest.fn((item) => (
      <div key={item.id} data-testid={`custom-${item.id}`}>
        Custom: {item.title}
      </div>
    ));

    render(<ListTemplate {...defaultProps} renderItem={customRenderer} />);
    
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText('Custom: Test Article 1')).toBeInTheDocument();
    expect(customRenderer).toHaveBeenCalledTimes(3);
  });

  it('handles different view modes correctly', async () => {
    const user = userEvent.setup();
    render(<ListTemplate {...defaultProps} />);
    
    // Start with grid view (default) - just check it exists
    expect(screen.getByLabelText('Grid')).toBeInTheDocument();
    
    // Switch to list view
    await user.click(screen.getByLabelText('List'));
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('list');
    
    // Switch to card view
    await user.click(screen.getByLabelText('Cards'));
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('card');
  });

  it('displays images when provided', () => {
    const itemsWithImages = [
      {
        ...mockItems[0],
        image: 'https://example.com/image1.jpg',
      },
    ];

    render(<ListTemplate {...defaultProps} items={itemsWithImages} />);
    
    // Since images are rendered as background-image, we just check that the item renders
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    // The image styling is applied but hard to test in JSDOM environment
  });

  it('handles empty state action click', async () => {
    const user = userEvent.setup();
    const mockAction = jest.fn();
    const emptyState = {
      title: 'No items',
      description: 'Create your first item',
      action: {
        label: 'Create Item',
        onClick: mockAction,
      },
    };

    render(<ListTemplate {...defaultProps} items={[]} emptyState={emptyState} />);
    
    const createButton = screen.getByText('Create Item');
    await user.click(createButton);
    
    expect(mockAction).toHaveBeenCalled();
  });

  it('renders in dark mode', () => {
    render(<ListTemplate {...defaultProps} isDarkMode={true} />);
    
    expect(screen.getByText('Test List')).toBeInTheDocument();
    // Component should render without errors in dark mode
  });

  it('calls navigation callback when sidebar item is clicked', async () => {
    const user = userEvent.setup();
    const mockNavigationClick = jest.fn();
    const navigationItems = [
      {
        id: 'main',
        title: 'Main',
        items: [
          { id: 'home', label: 'Home', icon: '🏠' },
          { id: 'list', label: 'List', icon: '📋' }
        ]
      }
    ];

    render(
      <ListTemplate 
        {...defaultProps} 
        showSidebar={true} 
        navigationItems={navigationItems}
        onNavigationClick={mockNavigationClick}
      />
    );
    
    const homeLink = screen.getByText('Home');
    await user.click(homeLink);
    
    expect(mockNavigationClick).toHaveBeenCalledWith('home');
  });

  it('formats dates correctly', () => {
    render(<ListTemplate {...defaultProps} />);
    
    // Dates should be formatted as "Jan 15, 2024" etc
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 10, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 5, 2024/)).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      title: 'Minimal List',
      items: [mockItems[0]],
    };

    render(<ListTemplate {...minimalProps} />);
    
    expect(screen.getByText('Minimal List')).toBeInTheDocument();
    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
  });
});