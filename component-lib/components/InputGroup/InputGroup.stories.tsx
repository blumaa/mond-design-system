import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

const meta: Meta<typeof InputGroup> = {
  title: 'Components/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    prefix: {
      control: 'text',
    },
    suffix: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="Enter text..." />
    </InputGroup>
  ),
};

export const WithPrefix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Text Prefix</h3>
        <InputGroup prefix="https://">
          <Input placeholder="example.com" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Icon Prefix</h3>
        <InputGroup prefix="🔍">
          <Input placeholder="Search..." />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Currency Prefix</h3>
        <InputGroup prefix="$">
          <Input placeholder="0.00" />
        </InputGroup>
      </div>
    </div>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Domain Suffix</h3>
        <InputGroup suffix="@company.com">
          <Input placeholder="username" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Unit Suffix</h3>
        <InputGroup suffix="kg">
          <Input placeholder="Weight" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Decimal Suffix</h3>
        <InputGroup suffix=".00">
          <Input placeholder="100" />
        </InputGroup>
      </div>
    </div>
  ),
};

export const BothPrefixAndSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '350px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Price Input</h3>
        <InputGroup prefix="$" suffix=".00">
          <Input placeholder="0" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>URL Builder</h3>
        <InputGroup prefix="https://" suffix=".com">
          <Input placeholder="example" />
        </InputGroup>
      </div>
    </div>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '400px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Search with Button</h3>
        <InputGroup 
          prefix="🔍"
          suffix={<Button size="sm" variant="primary">Search</Button>}
        >
          <Input placeholder="Enter search query..." />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Copy Action</h3>
        <InputGroup 
          suffix={<Button size="sm" variant="outline">Copy</Button>}
        >
          <Input value="https://example.com/share/abc123" readOnly />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Multiple Actions</h3>
        <InputGroup 
          prefix={<Button size="sm" variant="ghost">📁</Button>}
          suffix={
            <div style={{ display: 'flex', gap: '2px' }}>
              <Button size="sm" variant="ghost">Clear</Button>
              <Button size="sm" variant="primary">Save</Button>
            </div>
          }
        >
          <Input placeholder="File name..." />
        </InputGroup>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Small</h3>
        <InputGroup inputSize="sm" prefix="🔍">
          <Input placeholder="Small search..." />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Medium (Default)</h3>
        <InputGroup inputSize="md" prefix="🔍">
          <Input placeholder="Medium search..." />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Large</h3>
        <InputGroup inputSize="lg" prefix="🔍">
          <Input placeholder="Large search..." />
        </InputGroup>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Default</h3>
        <InputGroup variant="default" prefix="📧">
          <Input placeholder="email@example.com" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Error State</h3>
        <InputGroup variant="error" prefix="⚠️">
          <Input placeholder="Invalid input" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Success State</h3>
        <InputGroup variant="success" prefix="✅">
          <Input placeholder="Valid input" />
        </InputGroup>
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '400px' }}>
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Search Bar</h3>
        <InputGroup 
          prefix="🔍"
          suffix={<Button size="sm" variant="primary">Search</Button>}
        >
          <Input placeholder="Search products, articles, help..." />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Price Input</h3>
        <InputGroup prefix="$" suffix=".00">
          <Input placeholder="0" type="number" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Email Signup</h3>
        <InputGroup 
          prefix="📧"
          suffix={<Button size="sm" variant="primary">Subscribe</Button>}
        >
          <Input placeholder="your@email.com" type="email" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Phone Number</h3>
        <InputGroup prefix="+1">
          <Input placeholder="(555) 123-4567" type="tel" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Website URL</h3>
        <InputGroup prefix="https://" suffix=".com">
          <Input placeholder="yoursite" />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '14px', fontWeight: 600 }}>Share Link</h3>
        <InputGroup 
          suffix={<Button size="sm" variant="outline">Copy Link</Button>}
        >
          <Input 
            value="https://example.com/shared/abc123xyz" 
            readOnly 
            style={{ backgroundColor: '#f9f9f9' }}
          />
        </InputGroup>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '2rem', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      minWidth: '400px'
    }}>
      <div>
        <h3 style={{ 
          marginBottom: '0.5rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Search
        </h3>
        <InputGroup 
          isDarkMode
          prefix="🔍"
          suffix={<Button size="sm" variant="primary" isDarkMode>Search</Button>}
        >
          <Input placeholder="Search in dark mode..." isDarkMode />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ 
          marginBottom: '0.5rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Price
        </h3>
        <InputGroup isDarkMode prefix="$" suffix=".00">
          <Input placeholder="0" type="number" isDarkMode />
        </InputGroup>
      </div>
      
      <div>
        <h3 style={{ 
          marginBottom: '0.5rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Email
        </h3>
        <InputGroup 
          isDarkMode
          prefix="📧"
          suffix={<Button size="sm" variant="outline" isDarkMode>Send</Button>}
        >
          <Input placeholder="email@example.com" type="email" isDarkMode />
        </InputGroup>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const Playground: Story = {
  args: {
    inputSize: 'md',
    variant: 'default',
    isDarkMode: false,
    prefix: '🔍',
    suffix: '',
  },
  render: (args) => (
    <InputGroup {...args}>
      <Input placeholder="Type something..." />
    </InputGroup>
  ),
};