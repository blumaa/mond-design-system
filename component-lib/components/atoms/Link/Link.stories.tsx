import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useGlobals } from 'storybook/internal/preview-api';
import { Link } from './Link';

// Example icon component for stories
const ExampleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Link } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Link href="https://example.com" size="medium">
      Visit our website
    </Link>
  );
}
\`\`\`

A semantic link component that maintains consistent styling and accessibility across your application. Supports both internal and external links with proper focus management.

**Key Features:**
- 🔗 Semantic HTML anchor elements with proper attributes
- 📏 Three sizes (small, medium, large) for different contexts
- ✨ Icon support for enhanced visual meaning
- 🎯 Icon-only variant for compact interfaces
- ♿ Full keyboard navigation and accessibility
- 🌙 Automatic color adaptation for dark mode
- 🎨 Hover and focus state management
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    iconOnly: {
      control: { type: 'boolean' },
      description: 'Icon-only link with no text',
    },
    children: {
      control: { type: 'text' },
      description: 'Link content (text)',
    },
    href: {
      control: { type: 'text' },
      description: 'Link destination URL',
    },
    target: {
      control: { type: 'text' },
      description: 'Link target (e.g., _blank)',
    },
    rel: {
      control: { type: 'text' },
      description: 'Link rel attribute',
    },
  },
  decorators: [
    (Story, context) => {
      const [globals] = useGlobals();
      const isDark = globals.backgrounds?.value === '#333333' || globals.theme === 'dark';
      
      // Override the isDarkMode prop based on Storybook theme
      const storyArgs = {
        ...context.args,
        isDarkMode: isDark,
      };
      
      return (
        <div
          style={{
            padding: '3rem',
            backgroundColor: isDark ? '#27374D' : '#F2F3F4',
            borderRadius: '8px',
          }}
        >
          <Story args={storyArgs} />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    size: 'medium',
    children: 'Link',
    href: '#',
    iconOnly: false,
  },
};

export const IconAndText: Story = {
  args: {
    size: 'medium',
    icon: <ExampleIcon />,
    children: 'Link with Icon',
    href: '#',
    iconOnly: false,
  },
};

export const IconOnly: Story = {
  args: {
    size: 'medium',
    icon: <ExampleIcon />,
    href: '#',
    iconOnly: true,
  },
};