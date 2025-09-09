import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AccordionItem } from './AccordionItem';

const meta = {
  title: 'Atoms/AccordionItem',
  component: AccordionItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { AccordionItem } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div>
      <AccordionItem
        title="Expandable Section"
        expanded={expanded}
        onExpandedChange={setExpanded}
        size="md"
        variant="bordered"
      >
        This is the collapsible content that can contain any React elements,
        including text, images, forms, or other components.
      </AccordionItem>
    </div>
  );
}
\`\`\`

A single accordion item that can be expanded and collapsed. Part of the atomic design system - used internally by the Accordion component.

**Key Features:**
- 📂 Expandable/collapsible content sections
- 🎯 Controlled and uncontrolled modes
- 🎨 Multiple variants (default, bordered, filled)
- 📏 Multiple size options (sm, md, lg)
- 🔄 Custom expansion icons
- 👈👉 Configurable icon position (left/right)
- 🚫 Disabled state support
- 🌑 Dark mode compatibility
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The header content (trigger)'
    },
    children: {
      control: 'text',
      description: 'The collapsible content'
    },
    expanded: {
      control: 'boolean',
      description: 'Whether the item is expanded (controlled)'
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Default expanded state for uncontrolled mode'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the item is disabled'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size variant'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'filled'],
      description: 'Visual variant'
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Icon position'
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Dark mode styling'
    },
    itemId: {
      control: 'text',
      description: 'Unique identifier for accessibility'
    }
  },
  args: {
    title: 'Accordion Item Title',
    children: 'This is the collapsible content of the accordion item. It can contain any React content including text, images, forms, or other components.',
    size: 'md',
    variant: 'default',
    iconPosition: 'right',
    isDarkMode: false,
    disabled: false
  }
} satisfies Meta<typeof AccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  args: {
    defaultExpanded: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const DisabledExpanded: Story = {
  args: {
    disabled: true,
    defaultExpanded: true
  }
};

// Size Variants
export const SmallSize: Story = {
  args: {
    size: 'sm',
    title: 'Small Accordion Item'
  }
};

export const MediumSize: Story = {
  args: {
    size: 'md',
    title: 'Medium Accordion Item'
  }
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    title: 'Large Accordion Item'
  }
};

// Visual Variants
export const DefaultVariant: Story = {
  args: {
    variant: 'default',
    title: 'Default Variant'
  }
};

export const BorderedVariant: Story = {
  args: {
    variant: 'bordered',
    title: 'Bordered Variant'
  }
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    title: 'Filled Variant'
  }
};

// Icon Positions
export const IconLeft: Story = {
  args: {
    iconPosition: 'left',
    title: 'Icon on Left'
  }
};

export const IconRight: Story = {
  args: {
    iconPosition: 'right',
    title: 'Icon on Right'
  }
};

// Custom Icon
export const CustomIcon: Story = {
  args: {
    title: 'Custom Icon',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path 
          d="M8 3L13 8L8 13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    )
  }
};

// Dark Mode
export const DarkMode: Story = {
  args: {
    isDarkMode: true,
    title: 'Dark Mode Accordion'
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

// Rich Content
export const RichContent: Story = {
  args: {
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#3B82F6' }}>📋</span>
        <strong>Rich Title Content</strong>
        <span style={{ 
          backgroundColor: '#EF4444', 
          color: 'white', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          fontSize: '12px' 
        }}>
          New
        </span>
      </div>
    ),
    children: (
      <div>
        <h4 style={{ margin: '0 0 12px 0', color: '#1F2937' }}>Rich Content Example</h4>
        <p style={{ margin: '0 0 12px 0', lineHeight: '1.6' }}>
          This accordion item contains rich content including headings, paragraphs, lists, and more.
        </p>
        <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
          <li>Feature one with detailed description</li>
          <li>Feature two with additional context</li>
          <li>Feature three with important notes</li>
        </ul>
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#F3F4F6', 
          borderRadius: '6px',
          border: '1px solid #E5E7EB'
        }}>
          <strong>Note:</strong> This is a highlighted section within the accordion content.
        </div>
      </div>
    )
  }
};

// Controlled State Example
export const ControlledState: Story = {
  render: (args) => {
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'Expand'} from outside
          </button>
        </div>
        <AccordionItem
          {...args}
          expanded={expanded}
          onExpandedChange={setExpanded}
          title="Controlled Accordion Item"
        />
      </div>
    );
  }
};

// Multiple Items Stack
export const MultipleItems: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <AccordionItem
        {...args}
        title="First Item"
        variant="default"
        itemId="item-1"
      >
        Content for the first accordion item.
      </AccordionItem>
      <AccordionItem
        {...args}
        title="Second Item"
        variant="default"
        itemId="item-2"
      >
        Content for the second accordion item.
      </AccordionItem>
      <AccordionItem
        {...args}
        title="Third Item"
        variant="default"
        itemId="item-3"
        disabled
      >
        Content for the third accordion item.
      </AccordionItem>
    </div>
  )
};