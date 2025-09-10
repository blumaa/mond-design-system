import type { Meta, StoryObj } from '@storybook/react';
import { SearchResults, SearchResult, SearchFilter } from './SearchResults';
import { useState } from 'react';

const meta: Meta<typeof SearchResults> = {
  title: 'Organisms/SearchResults',
  component: SearchResults,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { SearchResults } from '@mond-design-system/theme';

function MyComponent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const response = await searchAPI(query);
      setResults(response.results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchResults
      results={results}
      query="React components"
      loading={loading}
      totalResults={127}
      currentPage={currentPage}
      onSearch={handleSearch}
      onPageChange={setCurrentPage}
    />
  );
}
\`\`\`

A comprehensive search interface component with filters, sorting, pagination, and multiple view modes. Perfect for search pages, documentation sites, e-commerce product listings, and content discovery interfaces.

**Key Features:**
- 🔍 Full-featured search interface with query input
- 🎯 Advanced filtering system with multiple filter types
- 📊 Sorting options (relevance, date, title, etc.)
- 📄 Pagination for large result sets
- 🔄 List and grid view modes
- 🎨 Customizable result item rendering
- ⚡ Loading states and empty state handling
- 📱 Responsive design for mobile and desktop
- ♿ Full accessibility with keyboard navigation
- 🌙 Dark mode support
- 🏷️ Rich metadata display (tags, categories, dates)
- 🎛️ Flexible configuration options
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    results: {
      control: false,
      description: 'Array of search results to display',
    },
    query: {
      control: 'text',
      description: 'Current search query',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    totalResults: {
      control: 'number',
      description: 'Total number of results for pagination',
    },
    currentPage: {
      control: 'number',
      description: 'Current page number',
    },
    resultsPerPage: {
      control: 'number',
      description: 'Number of results per page',
    },
    viewMode: {
      control: 'select',
      options: ['list', 'grid'],
      description: 'Display mode for results',
    },
    showFilters: {
      control: 'boolean',
      description: 'Whether to show filters sidebar',
    },
    showControls: {
      control: 'boolean',
      description: 'Whether to show search controls',
    },
    showResultCount: {
      control: 'boolean',
      description: 'Whether to show result count',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback when search is performed',
    },
    onFilterChange: {
      action: 'filter-changed',
      description: 'Callback when filter is changed',
    },
    onSortChange: {
      action: 'sort-changed',
      description: 'Callback when sort option is changed',
    },
    onPageChange: {
      action: 'page-changed',
      description: 'Callback when page is changed',
    },
    onViewModeChange: {
      action: 'view-mode-changed',
      description: 'Callback when view mode is changed',
    },
    onResultClick: {
      action: 'result-clicked',
      description: 'Callback when result item is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleResults: SearchResult[] = [
  {
    id: '1',
    title: 'Getting Started with React Components',
    description: 'Learn the fundamentals of building reusable React components with TypeScript. This comprehensive guide covers component design patterns, props validation, and performance optimization techniques.',
    url: 'https://example.com/react-components-guide',
    category: 'Tutorial',
    tags: ['React', 'TypeScript', 'Components', 'Frontend'],
    date: new Date('2025-09-01'),
    author: 'Sarah Wilson',
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns for React',
    description: 'Explore advanced TypeScript patterns and techniques for building type-safe React applications. Includes generic components, conditional types, and utility types.',
    url: 'https://example.com/typescript-patterns',
    category: 'Article',
    tags: ['TypeScript', 'React', 'Advanced', 'Patterns'],
    date: new Date('2025-08-28'),
    author: 'Michael Chen',
  },
  {
    id: '3',
    title: 'Building a Design System with Storybook',
    description: 'Step-by-step guide to creating a comprehensive design system using Storybook. Learn about component documentation, testing, and team collaboration.',
    url: 'https://example.com/design-system-storybook',
    category: 'Guide',
    tags: ['Design System', 'Storybook', 'Documentation', 'Components'],
    date: new Date('2025-08-25'),
    author: 'Emma Rodriguez',
  },
  {
    id: '4',
    title: 'Testing React Components with Jest',
    description: 'Complete testing strategy for React components using Jest and Testing Library. Covers unit tests, integration tests, and accessibility testing.',
    url: 'https://example.com/react-testing-jest',
    category: 'Tutorial',
    tags: ['Testing', 'Jest', 'React', 'Quality Assurance'],
    date: new Date('2025-08-20'),
    author: 'David Kim',
  },
  {
    id: '5',
    title: 'CSS-in-JS vs CSS Modules: A Comparison',
    description: 'Detailed comparison of different styling approaches for React applications. Analyze the pros and cons of CSS-in-JS, CSS Modules, and utility frameworks.',
    url: 'https://example.com/css-styling-comparison',
    category: 'Article',
    tags: ['CSS', 'Styling', 'Architecture', 'Performance'],
    date: new Date('2025-08-15'),
    author: 'Lisa Zhang',
  },
  {
    id: '6',
    title: 'React Hooks Best Practices',
    description: 'Master React Hooks with these proven best practices and patterns. Learn about custom hooks, performance optimization, and common pitfalls to avoid.',
    category: 'Guide',
    tags: ['React', 'Hooks', 'Best Practices', 'Performance', 'Custom Hooks', 'State Management'],
    date: new Date('2025-08-12'),
    author: 'Alex Johnson',
  },
];

const sampleFilters: SearchFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'article', label: 'Article', count: 12 },
      { value: 'tutorial', label: 'Tutorial', count: 8 },
      { value: 'guide', label: 'Guide', count: 6 },
      { value: 'reference', label: 'Reference', count: 4 },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { value: 'react', label: 'React', count: 15 },
      { value: 'typescript', label: 'TypeScript', count: 10 },
      { value: 'testing', label: 'Testing', count: 8 },
      { value: 'performance', label: 'Performance', count: 6 },
      { value: 'design-system', label: 'Design System', count: 4 },
    ],
  },
  {
    id: 'date',
    label: 'Date Range',
    type: 'date',
  },
];

export const Default: Story = {
  args: {
    results: sampleResults.slice(0, 3),
    query: 'React components',
    totalResults: 127,
    currentPage: 1,
    filters: sampleFilters,
    onSearch: () => {},
    onFilterChange: () => {},
    onSortChange: () => {},
    onPageChange: () => {},
    onViewModeChange: () => {},
    onResultClick: () => {},
  },
};

export const Loading: Story = {
  args: {
    results: [],
    query: 'React components',
    loading: true,
    filters: sampleFilters,
    onSearch: () => {},
  },
};

export const EmptyResults: Story = {
  args: {
    results: [],
    query: 'nonexistent search term',
    totalResults: 0,
    filters: sampleFilters,
    onSearch: () => {},
  },
};

export const GridView: Story = {
  args: {
    results: sampleResults,
    query: 'React',
    viewMode: 'grid',
    totalResults: 127,
    currentPage: 1,
    filters: sampleFilters,
    onSearch: () => {},
    onViewModeChange: () => {},
  },
};

export const WithoutFilters: Story = {
  args: {
    results: sampleResults.slice(0, 4),
    query: 'TypeScript',
    showFilters: false,
    totalResults: 45,
    onSearch: () => {},
  },
};

export const WithoutControls: Story = {
  args: {
    results: sampleResults.slice(0, 3),
    showControls: false,
    showFilters: false,
    onResultClick: () => {},
  },
};

export const CustomRenderer: Story = {
  args: {
    results: sampleResults.slice(0, 3),
    query: 'Custom rendering',
    renderResult: (result: SearchResult) => (
      <div
        key={result.id}
        style={{
          padding: '16px',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          marginBottom: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0', color: '#1e40af' }}>
          🔍 {result.title}
        </h3>
        <p style={{ margin: '0', color: '#374151', fontSize: '14px' }}>
          {result.description}
        </p>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
          By {result.author} • {result.category}
        </div>
      </div>
    ),
    onSearch: () => {},
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [results, setResults] = useState(sampleResults);
    const [query, setQuery] = useState('React components');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [sortBy, setSortBy] = useState('relevance');
    const handleSearch = async (newQuery: string) => {
      setLoading(true);
      setQuery(newQuery);
      
      // Simulate API call
      setTimeout(() => {
        const filtered = sampleResults.filter(result =>
          result.title.toLowerCase().includes(newQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(newQuery.toLowerCase()) ||
          result.tags?.some(tag => tag.toLowerCase().includes(newQuery.toLowerCase()))
        );
        setResults(filtered);
        setCurrentPage(1);
        setLoading(false);
      }, 800);
    };

    const handleFilterChange = (filterId: string, value: unknown) => {
      // Filter results based on active filters
      let filtered = sampleResults;
      
      if (value && filterId === 'category' && typeof value === 'string') {
        filtered = filtered.filter(result => 
          result.category?.toLowerCase() === value.toLowerCase()
        );
      }
      
      setResults(filtered);
      setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string) => {
      setSortBy(newSortBy);
      
      const sorted = [...results].sort((a, b) => {
        switch (newSortBy) {
          case 'date':
            return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'relevance':
          default:
            return 0;
        }
      });
      
      setResults(sorted);
    };

    return (
      <div style={{ height: '600px', overflow: 'auto' }}>
        <SearchResults
          results={results}
          query={query}
          loading={loading}
          totalResults={results.length}
          currentPage={currentPage}
          viewMode={viewMode}
          sortBy={sortBy}
          filters={sampleFilters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onPageChange={setCurrentPage}
          onViewModeChange={setViewMode}
          onResultClick={(result) => {
            alert(`Clicked: ${result.title}`);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing real search functionality with filtering, sorting, and view mode switching.',
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    results: Array.from({ length: 50 }, (_, i) => ({
      id: `item-${i + 1}`,
      title: `Search Result ${i + 1}`,
      description: `This is the description for search result number ${i + 1}. It contains relevant information about the topic.`,
      url: `https://example.com/result-${i + 1}`,
      category: ['Article', 'Tutorial', 'Guide'][i % 3],
      tags: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'].slice(0, (i % 4) + 1),
      date: new Date(2025, 7, 1 + (i % 30)),
      author: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'][i % 4],
    })),
    query: 'large dataset',
    totalResults: 1250,
    currentPage: 3,
    resultsPerPage: 25,
    filters: sampleFilters,
    onSearch: () => {},
    onPageChange: () => {},
  },
};

export const DarkMode: Story = {
  args: {
    results: sampleResults.slice(0, 4),
    query: 'Dark mode search',
    totalResults: 89,
    currentPage: 1,
    viewMode: 'list',
    filters: sampleFilters,
    isDarkMode: true,
    onSearch: () => {},
    onFilterChange: () => {},
    onViewModeChange: () => {},
  },
  parameters: {
    theme: 'dark',
  },
};

export const MobileView: Story = {
  args: {
    results: sampleResults.slice(0, 3),
    query: 'Mobile search',
    totalResults: 67,
    filters: sampleFilters.slice(0, 2), // Fewer filters for mobile
    onSearch: () => {},
    onFilterChange: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'SearchResults component optimized for mobile viewing with responsive layout.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    results: sampleResults,
    query: 'playground search',
    loading: false,
    totalResults: 156,
    currentPage: 1,
    resultsPerPage: 10,
    viewMode: 'list',
    showFilters: true,
    showControls: true,
    showResultCount: true,
    filters: sampleFilters,
    isDarkMode: false,
    onSearch: () => {},
    onFilterChange: () => {},
    onSortChange: () => {},
    onPageChange: () => {},
    onViewModeChange: () => {},
    onResultClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different SearchResults configurations.',
      },
    },
  },
};