import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';
import { Box } from '../Box';
import '../stories.css';

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

**Breaking Changes:**
- ⚠️ Removed \`color\` prop - use \`semantic\` prop instead for colored headings
- ⚠️ Removed custom prop escape hatch - component now uses strict typing
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
    responsive: {
      control: 'boolean',
    },
    isLongText: {
      control: 'boolean',
    },
    isReallyLongText: {
      control: 'boolean',
    },
  },
  args: {
    level: 1,
    weight: 'bold',
    semantic: 'primary',
    truncate: false,
    responsive: false,
    isLongText: false,
    isReallyLongText: false,
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
    <Box className="story-flex-column story-gap-16 story-max-width-600">
      <Heading level={1}>Heading 1 - Main page title</Heading>
      <Heading level={2}>Heading 2 - Major section</Heading>
      <Heading level={3}>Heading 3 - Sub-section</Heading>
      <Heading level={4}>Heading 4 - Sub-sub-section</Heading>
      <Heading level={5}>Heading 5 - Minor heading</Heading>
      <Heading level={6}>Heading 6 - Smallest heading</Heading>
    </Box>
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
    <Box className="story-flex-column story-gap-16 story-max-width-600">
      <Heading level={1} size="6xl">H1 with 6xl size</Heading>
      <Heading level={2} size="4xl">H2 with 4xl size</Heading>
      <Heading level={3} size="2xl">H3 with 2xl size</Heading>
      <Heading level={4} size="lg">H4 with lg size</Heading>
      <Heading level={5} size="sm">H5 with sm size</Heading>
      <Heading level={6} size="xs">H6 with xs size</Heading>
    </Box>
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
    <Box className="story-flex-column story-gap-12 story-max-width-600">
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
    </Box>
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
    <Box className="story-flex-column story-gap-12 story-max-width-600">
      <Heading level={2} weight="light">Light Weight (300)</Heading>
      <Heading level={2} weight="normal">Normal Weight (400)</Heading>
      <Heading level={2} weight="medium">Medium Weight (500)</Heading>
      <Heading level={2} weight="semibold">Semibold Weight (600)</Heading>
      <Heading level={2} weight="bold">Bold Weight (700) - Default</Heading>
      <Heading level={2} weight="extrabold">Extra Bold Weight (800)</Heading>
      <Heading level={2} weight="black">Black Weight (900)</Heading>
    </Box>
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
    <Box className="story-flex-column story-gap-12 story-max-width-600">
      <Heading semantic="primary">Primary Heading - Main content</Heading>
      <Heading semantic="secondary">Secondary Heading - Supporting content</Heading>
      <Heading semantic="tertiary">Tertiary Heading - Less important</Heading>
    </Box>
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
    <Box className="story-flex-column story-gap-16 story-width-400">
      <Heading align="left">Left Aligned Heading</Heading>
      <Heading align="center">Center Aligned Heading</Heading>
      <Heading align="right">Right Aligned Heading</Heading>
    </Box>
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
    <Box className="story-flex-column story-gap-16 story-max-width-250">
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Normal heading:
          </Heading>
        </Box>
        <Heading level={2}>
          This is a very long heading that would normally wrap to multiple lines
        </Heading>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Truncated heading:
          </Heading>
        </Box>
        <Heading level={2} truncate>
          This is a very long heading that would normally wrap to multiple lines
        </Heading>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Headings can be truncated with an ellipsis (...) when they overflow their container. Useful for cards, navigation, or constrained layouts.'
      }
    }
  }
};

export const InverseHeading: Story = {
  render: () => (
    <Box padding="6" className="story-bg-dark story-flex-column story-gap-12 story-max-width-600">
      <Heading semantic="inverse">Inverse Heading - Light text on dark background</Heading>
      <Heading level={2} semantic="inverse">Use for headings on dark surfaces</Heading>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the semantic="inverse" variant for headings on dark backgrounds. This ensures proper contrast and readability.'
      }
    }
  }
};

export const DarkMode: Story = {
  render: () => (
    <Box padding="6" className="story-bg-dark story-flex-column story-gap-16">
      <Heading level={1}>Primary Heading in Dark Mode</Heading>
      <Heading level={2} semantic="secondary">Secondary Heading in Dark Mode</Heading>
      <Heading level={3} semantic="tertiary">Tertiary Heading in Dark Mode</Heading>
      <Heading level={4} semantic="inverse">Inverse Heading in Dark Mode</Heading>
    </Box>
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
    <Box className="story-max-width-600 story-flex-column story-gap-16">
      <Heading level={1} size="4xl">Design System Guide</Heading>

      <Heading level={2} size="2xl" semantic="secondary">
        Getting Started
      </Heading>
      <Box as="p" marginBottom="4" className="story-paragraph">
        This section covers the basics of using our design system components.
      </Box>

      <Heading level={3} size="xl">Installation</Heading>
      <Box as="p" marginBottom="4" className="story-paragraph">
        Install the component library using your preferred package manager.
      </Box>

      <Heading level={4} size="lg">Package Managers</Heading>
      <Box as="p" marginBottom="4" className="story-paragraph">
        We support npm, yarn, and pnpm for installation.
      </Box>

      <Heading level={2} size="2xl" semantic="secondary">
        Components
      </Heading>
      <Box as="p" className="story-paragraph-no-margin">
        Explore our comprehensive collection of reusable components.
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how headings work together to create proper content hierarchy. Notice how semantic HTML structure (h1-h4) is maintained while visual sizes can be customized.'
      }
    }
  }
};

export const ResponsiveScaling: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-24">
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Non-responsive heading (fixed size):
          </Heading>
        </Box>
        <Heading level={1} size="3xl">
          This heading stays at 3xl on all screen sizes
        </Heading>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Responsive heading (auto-scaling):
          </Heading>
        </Box>
        <Heading level={1} size="3xl" responsive>
          This heading auto-scales: mobile (xl), tablet (3xl), desktop (4xl)
        </Heading>
      </Box>
      <Box padding="4" className="story-bg-info story-border-radius">
        <Heading level={4} size="xs" weight="semibold" semantic="primary">
          💡 Tip
        </Heading>
        <Box as="p" className="story-paragraph-small">
          Use the responsive prop to automatically scale headings across breakpoints. Mobile (≤639px): -2 sizes, Tablet (640-1024px): base size, Desktop (≥1025px): +1 size. Resize your browser to see the effect.
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the responsive prop to enable automatic scaling across mobile, tablet, and desktop breakpoints. The heading size will automatically adjust: mobile (-2 sizes), tablet (base size), and desktop (+1 size).'
      }
    }
  }
};

export const LongTextScaling: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-24">
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Normal heading (no scaling):
          </Heading>
        </Box>
        <Heading level={1} size="3xl">
          Short Title
        </Heading>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Long heading (isLongText):
          </Heading>
        </Box>
        <Heading level={1} size="3xl" isLongText>
          This is a much longer heading that would be too large on mobile devices
        </Heading>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Heading level={3} size="sm" weight="semibold">
            Really long heading (isReallyLongText):
          </Heading>
        </Box>
        <Heading level={1} size="3xl" isReallyLongText>
          This is an extremely long heading or page title that would definitely be way too large on mobile devices
        </Heading>
      </Box>
      <Box padding="4" className="story-bg-info story-border-radius">
        <Heading level={4} size="xs" weight="semibold" semantic="primary">
          💡 Tip
        </Heading>
        <Box as="p" className="story-paragraph-small">
          Use isLongText or isReallyLongText props to scale headings down more aggressively on mobile viewports (≤639px). isLongText scales down by 3 sizes, isReallyLongText by 4 sizes. Only affects mobile - no change on tablet/desktop.
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'For headings with long text that might be too large on mobile, use isLongText (mobile: -3 sizes) or isReallyLongText (mobile: -4 sizes). These props only affect mobile viewports (≤639px) and have no effect on tablet or desktop.'
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