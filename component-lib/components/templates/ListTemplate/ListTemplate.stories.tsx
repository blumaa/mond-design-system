import type { Meta, StoryObj } from '@storybook/react';
import { ListTemplate, type ListItem, type ListFilter, type ListSort } from './ListTemplate';
import { Badge } from '../../atoms/Badge/Badge';

const meta = {
  title: 'Templates/ListTemplate',
  component: ListTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive list template that supports search, filtering, sorting, multiple view modes, and pagination. Perfect for data-heavy applications like product catalogs, article lists, user directories, and more.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Template title',
    },
    description: {
      control: 'text',
      description: 'Template description',
    },
    searchEnabled: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Show navigation sidebar',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Dark mode',
    },
  },
} satisfies Meta<typeof ListTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleItems: ListItem[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    description: 'A comprehensive guide to learning React from the ground up. Covers components, state management, hooks, and best practices for building modern web applications.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
    category: 'Frontend',
    tags: ['React', 'JavaScript', 'Web Development'],
    date: new Date('2024-01-15'),
    author: 'Sarah Chen',
    status: 'active',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore advanced TypeScript features including generics, conditional types, mapped types, and utility types to write more robust code.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    category: 'Frontend',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    date: new Date('2024-01-10'),
    author: 'Mike Johnson',
    status: 'active',
  },
  {
    id: '3',
    title: 'Node.js Performance Optimization',
    description: 'Learn how to optimize Node.js applications for better performance, including memory management, async patterns, and profiling techniques.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=200&fit=crop',
    category: 'Backend',
    tags: ['Node.js', 'Performance', 'Optimization'],
    date: new Date('2024-01-08'),
    author: 'David Park',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Database Design Best Practices',
    description: 'Essential principles for designing scalable and efficient databases, covering normalization, indexing, and query optimization strategies.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=300&h=200&fit=crop',
    category: 'Database',
    tags: ['Database', 'SQL', 'Design'],
    date: new Date('2024-01-05'),
    author: 'Emma Davis',
    status: 'active',
  },
  {
    id: '5',
    title: 'Cloud Architecture Fundamentals',
    description: 'Understanding cloud computing principles, microservices architecture, and container orchestration with Docker and Kubernetes.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
    category: 'Cloud',
    tags: ['Cloud', 'Architecture', 'DevOps'],
    date: new Date('2024-01-01'),
    author: 'Alex Thompson',
    status: 'active',
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native, covering navigation, native modules, and app store deployment.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
    category: 'Mobile',
    tags: ['React Native', 'Mobile', 'Cross-platform'],
    date: new Date('2023-12-28'),
    author: 'Lisa Wang',
    status: 'archived',
  },
];

const productItems: ListItem[] = [
  {
    id: 'p1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    category: 'Electronics',
    tags: ['Audio', 'Wireless', 'Bluetooth'],
    status: 'active',
    metadata: { price: '$199.99', rating: 4.5 },
  },
  {
    id: 'p2',
    title: 'Smart Fitness Tracker',
    description: 'Track your daily activities, monitor heart rate, and get personalized health insights with this advanced fitness tracker.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=200&fit=crop',
    category: 'Health',
    tags: ['Fitness', 'Health', 'Wearable'],
    status: 'active',
    metadata: { price: '$129.99', rating: 4.2 },
  },
  {
    id: 'p3',
    title: 'Ergonomic Office Chair',
    description: 'Comfortable and supportive office chair with adjustable height, lumbar support, and breathable mesh back.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    category: 'Furniture',
    tags: ['Office', 'Ergonomic', 'Chair'],
    status: 'pending',
    metadata: { price: '$299.99', rating: 4.7 },
  },
  {
    id: 'p4',
    title: 'Portable Power Bank',
    description: 'High-capacity 20,000mAh power bank with fast charging support for all your mobile devices.',
    image: 'https://images.unsplash.com/photo-1609592424001-15cc79dfa2b7?w=300&h=200&fit=crop',
    category: 'Electronics',
    tags: ['Charging', 'Portable', 'Battery'],
    status: 'active',
    metadata: { price: '$49.99', rating: 4.3 },
  },
];

const sampleFilters: ListFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'Frontend', label: 'Frontend', count: 2 },
      { value: 'Backend', label: 'Backend', count: 1 },
      { value: 'Database', label: 'Database', count: 1 },
      { value: 'Cloud', label: 'Cloud', count: 1 },
      { value: 'Mobile', label: 'Mobile', count: 1 },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active', count: 4 },
      { value: 'pending', label: 'Pending', count: 1 },
      { value: 'archived', label: 'Archived', count: 1 },
    ],
  },
];

const productFilters: ListFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'Electronics', label: 'Electronics', count: 2 },
      { value: 'Health', label: 'Health', count: 1 },
      { value: 'Furniture', label: 'Furniture', count: 1 },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'select',
    options: [
      { value: '0-50', label: 'Under $50', count: 1 },
      { value: '50-200', label: '$50 - $200', count: 2 },
      { value: '200+', label: 'Over $200', count: 1 },
    ],
  },
];

const sortOptions: ListSort[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
];

const productSortOptions: ListSort[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name A-Z' },
];

export const Default: Story = {
  args: {
    title: 'Articles',
    description: 'Browse our collection of technical articles and tutorials.',
    items: sampleItems,
    searchEnabled: true,
    searchPlaceholder: 'Search articles...',
    filters: sampleFilters,
    sortOptions: sortOptions,
    pagination: {
      currentPage: 1,
      totalItems: 24,
      itemsPerPage: 6,
      showPageSize: true,
    },
    onSearch: (query) => console.log('Search:', query),
    onFilterChange: (filterId, value) => console.log('Filter:', filterId, value),
    onSortChange: (sort) => console.log('Sort:', sort),
    onViewChange: (view) => console.log('View:', view),
    onPageChange: (page) => console.log('Page:', page),
    onItemClick: (item) => console.log('Item clicked:', item),
    isDarkMode: false,
  },
};

export const ProductCatalog: Story = {
  args: {
    title: 'Product Catalog',
    description: 'Discover our range of premium products.',
    items: productItems,
    searchEnabled: true,
    searchPlaceholder: 'Search products...',
    filters: productFilters,
    sortOptions: productSortOptions,
    pagination: {
      currentPage: 1,
      totalItems: 48,
      itemsPerPage: 12,
    },
    renderItem: (item, viewMode) => {
      const isListView = viewMode === 'list';
      const price = item.metadata?.price as string;
      const rating = item.metadata?.rating as number;
      
      return (
        <div
          key={item.id}
          style={{
            padding: '16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: isListView ? 'row' : 'column', gap: '12px' }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: isListView ? '100px' : '100%',
                  height: isListView ? '80px' : '180px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.4 }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                <Badge variant="default">{item.category}</Badge>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {rating && (
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      ⭐ {rating}
                    </span>
                  )}
                  {price && (
                    <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#059669' }}>
                      {price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
    onItemClick: (item) => console.log('Product clicked:', item),
    isDarkMode: false,
  },
};

export const WithSidebar: Story = {
  args: {
    title: 'Knowledge Base',
    items: sampleItems,
    showSidebar: true,
    navigationItems: [
      {
        id: 'main',
        title: 'Main',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
          { id: 'articles', label: 'Articles', icon: '📚', active: true },
          { id: 'tutorials', label: 'Tutorials', icon: '🎓' },
        ],
      },
      {
        id: 'categories',
        title: 'Categories',
        items: [
          { id: 'frontend', label: 'Frontend', icon: '💻' },
          { id: 'backend', label: 'Backend', icon: '⚙️' },
          { id: 'database', label: 'Database', icon: '💾' },
        ],
      },
    ],
    filters: sampleFilters,
    sortOptions: sortOptions,
    onNavigationClick: (itemId) => console.log('Navigation:', itemId),
    isDarkMode: false,
  },
};

export const ListView: Story = {
  args: {
    title: 'User Directory',
    description: 'Find and connect with team members.',
    items: [
      {
        id: 'u1',
        title: 'Sarah Chen',
        description: 'Senior Frontend Developer with expertise in React, TypeScript, and modern web development practices.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        category: 'Engineering',
        tags: ['React', 'TypeScript', 'Leadership'],
        status: 'active',
      },
      {
        id: 'u2',
        title: 'Mike Johnson',
        description: 'Full-stack developer focused on Node.js backend systems and API development.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        category: 'Engineering',
        tags: ['Node.js', 'APIs', 'Database'],
        status: 'active',
      },
      {
        id: 'u3',
        title: 'Emma Davis',
        description: 'Product Manager with a passion for user experience and data-driven decision making.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        category: 'Product',
        tags: ['Strategy', 'UX', 'Analytics'],
        status: 'active',
      },
    ],
    viewOptions: [
      { id: 'list', label: 'List', icon: '☰', columns: 1 },
      { id: 'grid', label: 'Grid', icon: '▦', columns: 2 },
    ],
    searchPlaceholder: 'Search team members...',
    isDarkMode: false,
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Loading Example',
    items: [],
    loading: true,
    searchEnabled: true,
    filters: sampleFilters,
    isDarkMode: false,
  },
};

export const EmptyState: Story = {
  args: {
    title: 'No Results',
    description: 'When there are no items to display.',
    items: [],
    loading: false,
    searchEnabled: true,
    emptyState: {
      title: 'No articles found',
      description: 'Try adjusting your search terms or filters to find relevant content.',
      action: {
        label: 'Create New Article',
        onClick: () => alert('Create new article clicked!'),
      },
    },
    isDarkMode: false,
  },
};

export const CustomEmptyState: Story = {
  args: {
    title: 'Custom Empty State',
    items: [],
    loading: false,
    emptyState: {
      title: 'Welcome to your dashboard!',
      description: 'You haven\'t added any items yet. Get started by creating your first item.',
      action: {
        label: 'Get Started',
        onClick: () => alert('Get started clicked!'),
      },
    },
    isDarkMode: false,
  },
};

export const DarkMode: Story = {
  args: {
    title: 'Articles (Dark Mode)',
    description: 'Browse articles in dark mode.',
    items: sampleItems,
    searchEnabled: true,
    filters: sampleFilters,
    sortOptions: sortOptions,
    pagination: {
      currentPage: 1,
      totalItems: 24,
      itemsPerPage: 6,
    },
    isDarkMode: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const MinimalConfiguration: Story = {
  args: {
    title: 'Simple List',
    items: sampleItems.slice(0, 3),
    searchEnabled: false,
    isDarkMode: false,
  },
};