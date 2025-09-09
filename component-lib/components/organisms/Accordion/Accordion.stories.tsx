import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useGlobals } from 'storybook/internal/preview-api';
import { Accordion, AccordionItem } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Organisms/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Accordion } from '@mond-design-system/theme';

function MyComponent() {
  const items = [
    {
      id: 'faq1',
      title: 'What is React?',
      content: 'React is a JavaScript library for building user interfaces.'
    },
    {
      id: 'faq2', 
      title: 'How do I get started?',
      content: 'Install React and start building components!'
    }
  ];
  
  return (
    <Accordion 
      items={items}
      allowMultiple={false}
      size="md"
    />
  );
}
\`\`\`

A collapsible accordion component for organizing content in expandable sections. Perfect for FAQs, navigation menus, and content-heavy interfaces.

**Key Features:**
- 📋 Multiple expandable/collapsible sections
- 🔄 Single or multiple sections open simultaneously
- 📏 Three sizes (sm, md, lg) for different contexts
- 📝 Rich content support (text, HTML, React components)
- ⌨️ Full keyboard navigation (arrow keys, enter, space)
- ♿ ARIA compliant with proper expansion semantics
- 🌙 Dark mode support with proper contrast
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled'],
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
    },
    allowToggleOff: {
      control: 'boolean',
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story, context) => {
      const [globals] = useGlobals();
      const isDark = globals.backgrounds?.value === '#333333' || globals.theme === 'dark';
      
      const storyArgs = {
        ...context.args,
        isDarkMode: isDark,
      };
      
      return (
        <div style={{
          padding: '2rem',
          backgroundColor: isDark ? '#27374D' : '#F2F3F4', 
          borderRadius: '8px',
          minHeight: '400px',
        }}>
          <Story args={storyArgs} />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// Sample data for stories
const basicItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'What is React?',
    content: 'React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."',
  },
  {
    id: 'item-2',
    title: 'How do components work?',
    content: 'Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. Components can be defined as classes or functions.',
  },
  {
    id: 'item-3',
    title: 'What is JSX?',
    content: 'JSX is a syntax extension to JavaScript. It is similar to a template language, but it comes with the full power of JavaScript. JSX gets compiled to React.createElement() calls.',
  },
];

const complexItems: AccordionItem[] = [
  {
    id: 'getting-started',
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🚀</span>
        <span><strong>Getting Started</strong></span>
      </div>
    ),
    content: (
      <div>
        <p>Welcome to our design system! Here's how to get started:</p>
        <ol style={{ paddingLeft: '20px', margin: '12px 0' }}>
          <li>Install the package</li>
          <li>Import components</li>
          <li>Start building!</li>
        </ol>
        <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
          npm install @mond/design-system
        </code>
      </div>
    ),
  },
  {
    id: 'components',
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🧩</span>
        <span><strong>Available Components</strong></span>
      </div>
    ),
    content: (
      <div>
        <p>Our component library includes:</p>
        <ul style={{ paddingLeft: '20px', margin: '12px 0' }}>
          <li><strong>Atoms:</strong> Button, Input, Icon, Text</li>
          <li><strong>Molecules:</strong> FormField, InputGroup, ButtonGroup</li>
          <li><strong>Organisms:</strong> Header, Modal, Accordion, Pagination</li>
        </ul>
        <p style={{ color: '#666', fontSize: '14px' }}>
          All components follow atomic design principles for maximum reusability.
        </p>
      </div>
    ),
    defaultExpanded: true,
  },
  {
    id: 'customization',
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🎨</span>
        <span><strong>Customization</strong></span>
      </div>
    ),
    content: (
      <div>
        <p>Customize components to match your brand:</p>
        <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', margin: '12px 0' }}>
          <pre style={{ margin: 0, fontSize: '12px' }}>{`// Theme configuration
const theme = {
  colors: {
    primary: '#0284c7',
    secondary: '#64748b'
  },
  spacing: [0, 4, 8, 16, 24, 32]
}`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 'support',
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>💬</span>
        <span><strong>Support & Community</strong></span>
      </div>
    ),
    content: 'Need help? Join our community on Discord or check out our documentation. We also have weekly office hours for live support.',
    disabled: false,
  },
];

const itemsWithDisabled: AccordionItem[] = [
  ...basicItems.slice(0, 2),
  {
    id: 'disabled-item',
    title: 'Disabled Item',
    content: 'This content cannot be accessed because the item is disabled.',
    disabled: true,
  },
];


// Basic Stories
export const Default: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

export const MultipleMode: Story = {
  args: {
    items: basicItems,
    mode: 'multiple',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

export const NoToggleOff: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: false,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'In single mode with allowToggleOff disabled, at least one item must remain expanded.',
      },
    },
  },
};

// Variant Stories
export const BorderedVariant: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'bordered',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

export const FilledVariant: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'filled',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

// Size Stories
export const SmallSize: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'sm',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

export const LargeSize: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'lg',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
};

// Icon Position Stories
export const IconLeft: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'left',
  },
};

// Complex Content Story
export const ComplexContent: Story = {
  args: {
    items: complexItems,
    mode: 'single',
    variant: 'bordered',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accordion can contain rich content including HTML elements, code blocks, and custom styling.',
      },
    },
  },
};

// Disabled Items Story
export const WithDisabledItems: Story = {
  args: {
    items: itemsWithDisabled,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Individual accordion items can be disabled to prevent user interaction.',
      },
    },
  },
};

// Custom Icon Story
export const CustomIcon: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use custom icons for expand/collapse indicators. Icons automatically rotate based on state.',
      },
    },
  },
};

// No Animation Story
export const NoAnimation: Story = {
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'default',
    size: 'md',
    allowToggleOff: true,
    animated: false,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Animations can be disabled for reduced motion preferences or performance reasons.',
      },
    },
  },
};

// Controlled Mode Story
export const ControlledMode: Story = {
  render: (args) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(['item-2']);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
            Current expanded: {expandedIds.length ? expandedIds.join(', ') : 'none'}
          </p>
          <button
            onClick={() => setExpandedIds(['item-1'])}
            style={{
              marginRight: '8px',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Expand First
          </button>
          <button
            onClick={() => setExpandedIds([])}
            style={{
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            Collapse All
          </button>
        </div>
        <Accordion
          {...args}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
        />
      </div>
    );
  },
  args: {
    items: basicItems,
    mode: 'single',
    variant: 'bordered',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode allows external state management of expanded items. Use expandedIds and onExpandedChange props.',
      },
    },
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Default Variant</h3>
        <Accordion {...args} variant="default" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Bordered Variant</h3>
        <Accordion {...args} variant="bordered" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Filled Variant</h3>
        <Accordion {...args} variant="filled" />
      </div>
    </div>
  ),
  args: {
    items: basicItems.slice(0, 2), // Use fewer items for showcase
    mode: 'single',
    size: 'md',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available accordion variants side by side.',
      },
    },
  },
};

// All Sizes Showcase  
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Small Size</h3>
        <Accordion {...args} size="sm" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Medium Size</h3>
        <Accordion {...args} size="md" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Large Size</h3>
        <Accordion {...args} size="lg" />
      </div>
    </div>
  ),
  args: {
    items: basicItems.slice(0, 2), // Use fewer items for showcase
    mode: 'single',
    variant: 'bordered',
    allowToggleOff: true,
    animated: true,
    iconPosition: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available accordion sizes side by side.',
      },
    },
  },
};