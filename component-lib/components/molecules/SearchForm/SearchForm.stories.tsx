import type { Meta, StoryObj } from '@storybook/react';
import { SearchForm } from './SearchForm';
// Actions simplified for Storybook 9.x compatibility
import { useState } from 'react';

const meta: Meta<typeof SearchForm> = {
  title: 'Molecules/SearchForm',
  component: SearchForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
SearchForm is a molecule component that combines Input and Button atoms into a functional search interface. 
It provides built-in search and clear functionality with loading states and accessibility features.

## Features
- **Search Input**: Text input field with customizable placeholder
- **Search Button**: Submit button with configurable icon and label
- **Clear Button**: Optional clear button that appears when input has value
- **Loading State**: Spinner icon and disabled state during search operations
- **Keyboard Support**: Enter key triggers search
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled usage patterns
- **Accessibility**: Full ARIA support with proper roles and labels
- **Responsive Design**: Adapts button text visibility based on screen size

## Atomic Design
This molecule combines:
- **Input** (atom) - Search text input
- **Button** (atom) - Search and clear buttons  
- **Icon** (atom) - Search, clear, and loading icons
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant for input and buttons',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Shows loading spinner and disables interactions',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the entire search form',
    },
    showClearButton: {
      control: { type: 'boolean' },
      description: 'Show/hide clear button when input has value',
    },
    isDarkMode: {
      control: { type: 'boolean' },
      description: 'Enable dark mode styling',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for search input',
    },
    searchButtonLabel: {
      control: { type: 'text' },
      description: 'Label for search button (visible on larger sizes)',
    },
    onSearch: { action: 'searched' },
    onClear: { action: 'cleared' },
    onChange: { action: 'changed' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchForm>;

// Basic Examples
export const Default: Story = {
  args: {
    placeholder: 'Search...',
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'Initial search query',
    placeholder: 'Search products...',
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
};

// Size Variants
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <SearchForm {...args} size="sm" placeholder="Small search..." />
      <SearchForm {...args} size="md" placeholder="Medium search..." />
      <SearchForm {...args} size="lg" placeholder="Large search..." />
    </div>
  ),
  args: {
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchForm supports three size variants: sm, md (default), and lg.',
      },
    },
  },
};

// States
export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <div>
        <h4>Default</h4>
        <SearchForm {...args} placeholder="Enter search term..." />
      </div>
      <div>
        <h4>Loading</h4>
        <SearchForm {...args} loading placeholder="Searching..." defaultValue="search query" />
      </div>
      <div>
        <h4>Disabled</h4>
        <SearchForm {...args} disabled placeholder="Disabled search..." defaultValue="disabled" />
      </div>
      <div>
        <h4>With Value (shows clear button)</h4>
        <SearchForm {...args} defaultValue="sample search" placeholder="Search..." />
      </div>
    </div>
  ),
  args: {
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchForm supports various states including loading, disabled, and shows a clear button when there is a value.',
      },
    },
  },
};

// Clear Button Variants
export const ClearButtonOptions: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <div>
        <h4>With Clear Button (default)</h4>
        <SearchForm {...args} defaultValue="sample text" showClearButton={true} />
      </div>
      <div>
        <h4>Without Clear Button</h4>
        <SearchForm {...args} defaultValue="sample text" showClearButton={false} />
      </div>
    </div>
  ),
  args: {
    placeholder: 'Search...',
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'The clear button can be hidden by setting showClearButton to false.',
      },
    },
  },
};

// Custom Icons
export const CustomIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <SearchForm
        {...args}
        searchIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1"/>
          </svg>
        }
        clearIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 6l4 4M10 6l-4 4" stroke="currentColor" strokeWidth="2"/>
          </svg>
        }
        defaultValue="custom icons"
      />
    </div>
  ),
  args: {
    placeholder: 'Search with custom icons...',
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchForm allows customization of both search and clear icons.',
      },
    },
  },
};

// Controlled Component
export const ControlledExample: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleSearch = async (query: string) => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults([`Result 1 for "${query}"`, `Result 2 for "${query}"`, `Result 3 for "${query}"`]);
      setLoading(false);
    };

    const handleClear = () => {
      setValue('');
      setResults([]);
    };

    return (
      <div style={{ width: '400px' }}>
        <SearchForm
          {...args}
          value={value}
          loading={loading}
          onChange={setValue}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        {results.length > 0 && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h4>Search Results:</h4>
            <ul>
              {results.map((result, index) => (
                <li key={index}>{result}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  args: {
    placeholder: 'Search and see results...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of SearchForm as a controlled component with simulated search functionality and loading state.',
      },
    },
  },
};

// Dark Mode
export const DarkMode: Story = {
  render: (args) => (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '24px', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '400px'
    }}>
      <SearchForm {...args} isDarkMode placeholder="Search in dark mode..." />
      <SearchForm {...args} isDarkMode loading placeholder="Loading..." defaultValue="dark search" />
      <SearchForm {...args} isDarkMode defaultValue="dark mode with value" />
    </div>
  ),
  args: {
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchForm supports dark mode styling.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};

// Real-world Usage
export const EcommerceSearch: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query: string) => {
      setLoading(true);
      // Simulate product search
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
      alert(`Searching for products: "${query}"`);
    };

    return (
      <div style={{ width: '600px', maxWidth: '100%' }}>
        <h3>E-commerce Product Search</h3>
        <SearchForm
          {...args}
          value={value}
          loading={loading}
          onChange={setValue}
          onSearch={handleSearch}
          onClear={() => setValue('')}
          placeholder="Search for products, brands, or categories..."
          searchButtonLabel="Find Products"
          size="lg"
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of SearchForm used in an e-commerce context with realistic placeholder and button text.',
      },
    },
  },
};

// Responsive Behavior
export const ResponsiveDemo: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '200px' }}>
        <h4>Narrow (200px)</h4>
        <SearchForm {...args} size="sm" />
      </div>
      <div style={{ width: '400px' }}>
        <h4>Medium (400px)</h4>
        <SearchForm {...args} size="md" />
      </div>
      <div style={{ width: '600px' }}>
        <h4>Wide (600px)</h4>
        <SearchForm {...args} size="lg" />
      </div>
    </div>
  ),
  args: {
    placeholder: 'Responsive search...',
    searchButtonLabel: 'Search',
    onSearch: () => {},
    onClear: () => {},
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchForm adapts to different container widths, showing/hiding button text as appropriate.',
      },
    },
  },
};