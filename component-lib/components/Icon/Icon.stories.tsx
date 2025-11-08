import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

// Sample SVG icons for demonstration
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="currentColor"
    />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="currentColor"
    />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Icon } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Icon size="md" label="Search">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Icon>
  );
}
\`\`\`

A flexible Icon component that renders SVG icons with consistent sizing and accessibility features. Perfect for buttons, navigation, status indicators, and decorative elements.

**Key Features:**
- 📐 Six sizes (xs, sm, md, lg, xl, 2xl) for perfect scaling
- 🎨 Inherits text color by default, customizable with any color
- ♿ Full accessibility with screen reader support
- 🏷️ Decorative mode to hide from assistive technology
- 📝 Flexible content - accepts any SVG paths or elements
- 🎯 Proper ARIA labeling for semantic icons
- 🌙 Works seamlessly in light and dark themes
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    color: {
      control: 'color',
    },
    decorative: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
  },
  args: {
    size: 'md',
    decorative: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <HeartIcon />,
    label: 'Heart icon',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon size="xs" label="Extra small heart">
        <HeartIcon />
      </Icon>
      <Icon size="sm" label="Small heart">
        <HeartIcon />
      </Icon>
      <Icon size="md" label="Medium heart">
        <HeartIcon />
      </Icon>
      <Icon size="lg" label="Large heart">
        <HeartIcon />
      </Icon>
      <Icon size="xl" label="Extra large heart">
        <HeartIcon />
      </Icon>
      <Icon size="2xl" label="2x large heart">
        <HeartIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons come in 6 different sizes: xs (12px), sm (16px), md (20px), lg (24px), xl (32px), and 2xl (40px).'
      }
    }
  }
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon color="currentColor" label="Default color heart">
        <HeartIcon />
      </Icon>
      <Icon color="red" label="Red heart">
        <HeartIcon />
      </Icon>
      <Icon color="blue" label="Blue heart">
        <HeartIcon />
      </Icon>
      <Icon color="green" label="Green heart">
        <HeartIcon />
      </Icon>
      <Icon color="#8B5CF6" label="Purple heart">
        <HeartIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons inherit the current text color by default, but can be customized with any color value.'
      }
    }
  }
};

export const IconVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon label="Heart">
        <HeartIcon />
      </Icon>
      <Icon label="Star">
        <StarIcon />
      </Icon>
      <Icon label="Check">
        <CheckIcon />
      </Icon>
      <Icon label="Search">
        <SearchIcon />
      </Icon>
      <Icon label="Arrow right">
        <ArrowRightIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different icon styles - filled, outlined, and stroke-based icons all work with the Icon component.'
      }
    }
  }
};

export const Decorative: Story = {
  args: {
    children: <HeartIcon />,
    decorative: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Decorative icons are hidden from screen readers using aria-hidden="true" and do not need a label.'
      }
    }
  }
};

export const WithLabel: Story = {
  args: {
    children: <CheckIcon />,
    label: 'Task completed successfully',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icons with semantic meaning should include an accessible label for screen readers.'
      }
    }
  }
};

export const InText: Story = {
  render: () => (
    <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
      This task is complete{' '}
      <Icon size="sm" color="green" decorative>
        <CheckIcon />
      </Icon>
      {' '}and you can search{' '}
      <Icon size="sm" decorative>
        <SearchIcon />
      </Icon>
      {' '}for more tasks.
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons can be used inline with text content. Use decorative icons when the meaning is already conveyed by the surrounding text.'
      }
    }
  }
};

export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ padding: '8px', backgroundColor: '#fef2f2', borderRadius: '8px', display: 'inline-flex' }}>
        <Icon
          size="lg"
          color="red"
          label="Heart with background"
        >
          <HeartIcon />
        </Icon>
      </div>
      <div style={{ border: '2px solid blue', borderRadius: '50%', padding: '8px', display: 'inline-flex' }}>
        <Icon
          size="lg"
          color="blue"
          label="Star with border"
        >
          <StarIcon />
        </Icon>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons can be wrapped in containers for custom styling like backgrounds and borders.'
      }
    }
  }
};