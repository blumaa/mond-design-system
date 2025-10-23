import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Heading } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Heading level={1} size="3xl">
      Your Page Title
    </Heading>
  );
}
\`\`\`

A flexible Heading component for creating semantic headings (h1-h6) with consistent typography hierarchy and styling options. Maintains proper HTML semantics while allowing visual customization.

**Key Features:**
- 🏷️ Six semantic levels (h1-h6) for proper document structure
- 📏 Ten size variants (xs to 6xl) for visual hierarchy
- 🎨 Semantic color variants (primary, secondary, tertiary, inverse)
- 🔤 Complete font weight support (light to black)
- 📐 Text alignment options (left, center, right)
- ✂️ Text truncation with ellipsis
- ♿ Full accessibility and screen reader support
- 🌙 Dark mode support
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
    semantic: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'inverse'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    truncate: {
      control: 'boolean',
    },
  },
  args: {
    level: 1,
    weight: 'bold',
    semantic: 'primary',
    truncate: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a default heading',
  },
};

export const HeadingLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Heading level={1}>Heading 1 - Main page title</Heading>
      <Heading level={2}>Heading 2 - Major section</Heading>
      <Heading level={3}>Heading 3 - Sub-section</Heading>
      <Heading level={4}>Heading 4 - Sub-sub-section</Heading>
      <Heading level={5}>Heading 5 - Minor heading</Heading>
      <Heading level={6}>Heading 6 - Smallest heading</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headings come in 6 levels (h1-h6) with decreasing font sizes and appropriate line heights. Each level has semantic meaning and should be used to create proper document hierarchy.'
      }
    }
  }
};

export const CustomSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Heading level={1} size="6xl">H1 with 6xl size</Heading>
      <Heading level={2} size="4xl">H2 with 4xl size</Heading>
      <Heading level={3} size="2xl">H3 with 2xl size</Heading>
      <Heading level={4} size="lg">H4 with lg size</Heading>
      <Heading level={5} size="sm">H5 with sm size</Heading>
      <Heading level={6} size="xs">H6 with xs size</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'You can override the default size for any heading level. This allows you to maintain semantic HTML structure while having visual flexibility.'
      }
    }
  }
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
      <Heading size="6xl">6XL Size - Largest heading</Heading>
      <Heading size="5xl">5XL Size - Extra large heading</Heading>
      <Heading size="4xl">4XL Size - Very large heading</Heading>
      <Heading size="3xl">3XL Size - Large heading</Heading>
      <Heading size="2xl">2XL Size - Medium-large heading</Heading>
      <Heading size="xl">XL Size - Medium heading</Heading>
      <Heading size="lg">Large Size - Smaller heading</Heading>
      <Heading size="md">Medium Size - Small heading</Heading>
      <Heading size="sm">Small Size - Very small heading</Heading>
      <Heading size="xs">Extra Small Size - Tiny heading</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available sizes from xs to 6xl. Larger sizes (4xl-6xl) use tighter line height for better visual hierarchy.'
      }
    }
  }
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
      <Heading level={2} weight="light">Light Weight (300)</Heading>
      <Heading level={2} weight="normal">Normal Weight (400)</Heading>
      <Heading level={2} weight="medium">Medium Weight (500)</Heading>
      <Heading level={2} weight="semibold">Semibold Weight (600)</Heading>
      <Heading level={2} weight="bold">Bold Weight (700) - Default</Heading>
      <Heading level={2} weight="extrabold">Extra Bold Weight (800)</Heading>
      <Heading level={2} weight="black">Black Weight (900)</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different font weights available for headings. Bold (700) is the default weight, but you can adjust based on your design needs.'
      }
    }
  }
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
      <Heading semantic="primary">Primary Heading - Main content</Heading>
      <Heading semantic="secondary">Secondary Heading - Supporting content</Heading>
      <Heading semantic="tertiary">Tertiary Heading - Less important</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic color variants that automatically adapt to light and dark themes. Each variant conveys different levels of importance in your content hierarchy.'
      }
    }
  }
};

export const TextAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <Heading align="left">Left Aligned Heading</Heading>
      <Heading align="center">Center Aligned Heading</Heading>
      <Heading align="right">Right Aligned Heading</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headings can be aligned left, center, or right within their container.'
      }
    }
  }
};

export const TruncatedHeading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '250px' }}>
      <div>
        <Heading level={3} style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          Normal heading:
        </Heading>
        <Heading level={2}>
          This is a very long heading that would normally wrap to multiple lines
        </Heading>
      </div>
      <div>
        <Heading level={3} style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
          Truncated heading:
        </Heading>
        <Heading level={2} truncate>
          This is a very long heading that would normally wrap to multiple lines
        </Heading>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headings can be truncated with an ellipsis (...) when they overflow their container. Useful for cards, navigation, or constrained layouts.'
      }
    }
  }
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
      <Heading color="currentColor">Default Color</Heading>
      <Heading color="red">Red Custom Color</Heading>
      <Heading color="blue">Blue Custom Color</Heading>
      <Heading color="green">Green Custom Color</Heading>
      <Heading color="#8B5CF6">Purple Custom Color</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'You can override semantic colors with custom color values for special use cases.'
      }
    }
  }
};

export const DarkMode: Story = {
  render: () => (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      color: '#ffffff', 
      padding: '24px', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Heading level={1}>Primary Heading in Dark Mode</Heading>
      <Heading level={2} semantic="secondary">Secondary Heading in Dark Mode</Heading>
      <Heading level={3} semantic="tertiary">Tertiary Heading in Dark Mode</Heading>
      <Heading level={4} semantic="inverse">Inverse Heading in Dark Mode</Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headings automatically adapt their colors for dark mode when is true. Semantic colors are adjusted for optimal contrast.'
      }
    }
  }
};

export const ContentHierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Heading level={1} size="4xl">Design System Guide</Heading>
      
      <Heading level={2} size="2xl" semantic="secondary">
        Getting Started
      </Heading>
      <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
        This section covers the basics of using our design system components.
      </p>
      
      <Heading level={3} size="xl">Installation</Heading>
      <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
        Install the component library using your preferred package manager.
      </p>
      
      <Heading level={4} size="lg">Package Managers</Heading>
      <p style={{ margin: '0 0 16px 0', color: '#64748b' }}>
        We support npm, yarn, and pnpm for installation.
      </p>
      
      <Heading level={2} size="2xl" semantic="secondary">
        Components
      </Heading>
      <p style={{ margin: '0', color: '#64748b' }}>
        Explore our comprehensive collection of reusable components.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how headings work together to create proper content hierarchy. Notice how semantic HTML structure (h1-h4) is maintained while visual sizes can be customized.'
      }
    }
  }
};

export const InteractivePlayground: Story = {
  args: {
    level: 1,
    children: 'Customize this heading',
    size: '3xl',
    weight: 'bold',
    semantic: 'primary',
    align: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with different heading configurations and see how they affect the appearance.'
      }
    }
  }
};