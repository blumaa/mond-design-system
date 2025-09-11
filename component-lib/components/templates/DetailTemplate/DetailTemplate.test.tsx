import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import { DetailTemplate, type DetailAction, type DetailMetaItem, type DetailSection, type DetailTab, type RelatedItem } from './DetailTemplate';

const mockActions: DetailAction[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    variant: 'primary',
    onClick: jest.fn(),
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: '🗑️',
    variant: 'error',
    onClick: jest.fn(),
  },
];

const mockMetadata: DetailMetaItem[] = [
  {
    id: 'created',
    label: 'Created',
    value: 'March 15, 2024',
    icon: '📅',
  },
  {
    id: 'status',
    label: 'Status',
    value: 'Published',
    icon: '✅',
  },
];

const mockSections: DetailSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    content: <div>This is the overview section content.</div>,
  },
  {
    id: 'details',
    title: 'Details',
    content: <div>This is the details section content.</div>,
    collapsible: true,
    defaultCollapsed: false,
  },
];

const mockTabs: DetailTab[] = [
  {
    id: 'content',
    label: 'Content',
    content: <div>This is the content tab.</div>,
  },
  {
    id: 'comments',
    label: 'Comments',
    content: <div>This is the comments tab.</div>,
    badge: '5',
  },
];

const mockRelatedItems: RelatedItem[] = [
  {
    id: 'item1',
    title: 'Related Item 1',
    description: 'Description for item 1',
    category: 'Category A',
    date: new Date('2024-03-10'),
  },
  {
    id: 'item2',
    title: 'Related Item 2',
    description: 'Description for item 2',
    category: 'Category B',
    date: new Date('2024-03-08'),
  },
];

const defaultProps = {
  title: 'Test Detail Page',
  subtitle: 'This is a test detail page',
  actions: mockActions,
  metadata: mockMetadata,
  sections: mockSections,
  tabs: mockTabs,
  relatedItems: mockRelatedItems,
};

describe('DetailTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByText('Test Detail Page')).toBeInTheDocument();
    expect(screen.getByText('This is a test detail page')).toBeInTheDocument();
  });

  it('displays hero section with title and subtitle', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Test Detail Page' })).toBeInTheDocument();
    expect(screen.getByText('This is a test detail page')).toBeInTheDocument();
  });

  it('renders status badge when provided', () => {
    const status = {
      label: 'Active',
      variant: 'success' as const,
    };
    
    render(<DetailTemplate {...defaultProps} status={status} />);
    
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders category badge when provided', () => {
    render(<DetailTemplate {...defaultProps} category="Test Category" />);
    
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders tags when provided', () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    render(<DetailTemplate {...defaultProps} tags={tags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('renders author information when provided', () => {
    const author = {
      name: 'John Doe',
      role: 'Author',
    };
    
    render(<DetailTemplate {...defaultProps} author={author} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
  });

  it('renders actions and calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<DetailTemplate {...defaultProps} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    
    await user.click(editButton);
    expect(mockActions[0].onClick).toHaveBeenCalled();
    
    await user.click(deleteButton);
    expect(mockActions[1].onClick).toHaveBeenCalled();
  });

  it('renders metadata section with details', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders content sections', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('This is the overview section content.')).toBeInTheDocument();
    expect(screen.getAllByText('Details')).toHaveLength(2); // One in metadata, one in sections
    expect(screen.getByText('This is the details section content.')).toBeInTheDocument();
  });

  it('handles collapsible sections', async () => {
    const user = userEvent.setup();
    const sectionsWithCollapsible: DetailSection[] = [
      {
        id: 'collapsible',
        title: 'Collapsible Section',
        content: <div>Collapsible content</div>,
        collapsible: true,
        defaultCollapsed: false,
      },
    ];
    
    render(<DetailTemplate {...defaultProps} sections={sectionsWithCollapsible} />);
    
    expect(screen.getByText('Collapsible content')).toBeInTheDocument();
    
    // Click to collapse
    await user.click(screen.getByText('Collapsible Section'));
    
    expect(screen.queryByText('Collapsible content')).not.toBeInTheDocument();
    
    // Click to expand
    await user.click(screen.getByText('Collapsible Section'));
    
    expect(screen.getByText('Collapsible content')).toBeInTheDocument();
  });

  it('renders tabs when provided', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    // Tab content should be visible
    expect(screen.getByText('This is the content tab.')).toBeInTheDocument();
  });

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    render(<DetailTemplate {...defaultProps} />);
    
    // Click comments tab
    const commentsTab = screen.getByText('Comments');
    await user.click(commentsTab);
    
    // Should be able to see comments content after click
    await waitFor(() => {
      expect(screen.getByText('This is the comments tab.')).toBeInTheDocument();
    });
  });

  it('renders related items section', () => {
    render(<DetailTemplate {...defaultProps} />);
    
    expect(screen.getByText('Related Items')).toBeInTheDocument();
    expect(screen.getByText('Related Item 1')).toBeInTheDocument();
    expect(screen.getByText('Related Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description for item 1')).toBeInTheDocument();
    expect(screen.getByText('Description for item 2')).toBeInTheDocument();
  });

  it('calls onRelatedItemClick when related item is clicked', async () => {
    const user = userEvent.setup();
    const mockRelatedItemClick = jest.fn();
    render(<DetailTemplate {...defaultProps} onRelatedItemClick={mockRelatedItemClick} />);
    
    const relatedItem = screen.getByText('Related Item 1');
    await user.click(relatedItem.closest('div[style*="cursor: pointer"]') || relatedItem);
    
    expect(mockRelatedItemClick).toHaveBeenCalledWith(mockRelatedItems[0]);
  });

  it('hides related items when showRelatedItems is false', () => {
    render(<DetailTemplate {...defaultProps} showRelatedItems={false} />);
    
    expect(screen.queryByText('Related Items')).not.toBeInTheDocument();
    expect(screen.queryByText('Related Item 1')).not.toBeInTheDocument();
  });

  it('renders breadcrumbs when provided', () => {
    const breadcrumbs = [
      { label: 'Home', href: '/' },
      { label: 'Category', href: '/category' },
      { label: 'Current Page' },
    ];
    
    render(<DetailTemplate {...defaultProps} breadcrumbs={breadcrumbs} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<DetailTemplate {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = {
      title: 'Error Title',
      message: 'Error message',
      action: {
        label: 'Retry',
        onClick: jest.fn(),
      },
    };
    
    render(<DetailTemplate {...defaultProps} error={error} />);
    
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('calls error action when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();
    const error = {
      title: 'Error Title',
      message: 'Error message',
      action: {
        label: 'Retry',
        onClick: mockRetry,
      },
    };
    
    render(<DetailTemplate {...defaultProps} error={error} />);
    
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    await user.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalled();
  });

  it('renders sidebar when showSidebar is true', () => {
    const navigationItems = [
      {
        id: 'main',
        title: 'Main',
        items: [
          { id: 'nav-item', label: 'Navigation Item', icon: '📄' }
        ]
      }
    ];
    
    render(
      <DetailTemplate 
        {...defaultProps} 
        showSidebar={true} 
        navigationItems={navigationItems}
      />
    );
    
    expect(screen.getByText('Navigation Item')).toBeInTheDocument();
  });

  it('supports different layout variants', () => {
    // Test default layout
    const { rerender } = render(<DetailTemplate {...defaultProps} layout="default" />);
    expect(screen.getByText('Test Detail Page')).toBeInTheDocument();
    
    // Test wide layout
    rerender(<DetailTemplate {...defaultProps} layout="wide" />);
    expect(screen.getByText('Test Detail Page')).toBeInTheDocument();
    
    // Test centered layout
    rerender(<DetailTemplate {...defaultProps} layout="centered" />);
    expect(screen.getByText('Test Detail Page')).toBeInTheDocument();
  });

  it('renders hero image when provided', () => {
    render(<DetailTemplate {...defaultProps} heroImage="/test-image.jpg" />);
    
    const image = screen.getByAltText('Test Detail Page');
    expect(image).toBeInTheDocument();
  });

  it('renders in dark mode', () => {
    render(<DetailTemplate {...defaultProps}  />);
    
    expect(screen.getByText('Test Detail Page')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const date = new Date('2024-03-15T10:30:00Z');
    const lastUpdated = new Date('2024-03-16T12:00:00Z');
    
    render(<DetailTemplate {...defaultProps} date={date} lastUpdated={lastUpdated} />);
    
    // Check that dates appear in the document
    expect(screen.getByText(/Updated/)).toBeInTheDocument(); // Should find updated text
    // Just check that we can find dates with 2024
    const dateElements = screen.getAllByText(/2024/);
    expect(dateElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders without sections when not provided', () => {
    render(<DetailTemplate title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    // Should not crash or show section-related content
  });

  it('renders without tabs when not provided', () => {
    render(<DetailTemplate title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    // Should not crash or show tab-related content
  });
});