import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { colors } from '../../tokens';
import {
  HeartIcon,
  StarIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';

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
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function MyComponent() {
  return (
    <Icon size="md" label="Search">
      <MagnifyingGlassIcon />
    </Icon>
  );
}
\`\`\`

A flexible Icon component that wraps SVG icons (like Heroicons) with consistent sizing and accessibility features. Perfect for buttons, navigation, status indicators, and decorative elements.

**Key Features:**
- 📐 Six sizes (xs, sm, md, lg, xl, 2xl) for perfect scaling
- 🎨 Inherits text color by default, customizable with any color
- ♿ Full accessibility with screen reader support
- 🏷️ Decorative mode to hide from assistive technology
- 📝 Works with any SVG icon library (Heroicons, Lucide, etc.)
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
      <Icon label="Default color heart">
        <HeartIcon />
      </Icon>
      <Icon color={colors.red["500"]} label="Red heart">
        <HeartIcon />
      </Icon>
      <Icon color={colors.blue["500"]} label="Blue heart">
        <HeartIcon />
      </Icon>
      <Icon color={colors.green["500"]} label="Green heart">
        <HeartIcon />
      </Icon>
      <Icon color={colors.brand.primary["500"]} label="Primary brand heart">
        <HeartIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons inherit the current text color by default, but can be customized with color values from the design system tokens.'
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
        <MagnifyingGlassIcon />
      </Icon>
      <Icon label="Arrow right">
        <ArrowRightIcon />
      </Icon>
      <Icon label="Wrench and screwdriver">
        <WrenchScrewdriverIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different Heroicons used with the Icon component.'
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
      <Icon size="sm" color={colors.green["500"]} decorative>
        <CheckIcon />
      </Icon>
      {' '}and you can search{' '}
      <Icon size="sm" decorative>
        <MagnifyingGlassIcon />
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
      <Icon
        size="lg"
        color="red"
        style={{ padding: '8px', backgroundColor: '#fef2f2', borderRadius: '8px' }}
        label="Heart with background"
      >
        <HeartIcon />
      </Icon>
      <Icon
        size="lg"
        color="blue"
        style={{ border: '2px solid currentColor', borderRadius: '50%', padding: '8px' }}
        label="Star with border"
      >
        <StarIcon />
      </Icon>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons support custom styling through the style prop and standard SVG attributes.'
      }
    }
  }
};