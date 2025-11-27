import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';
import { Box } from '../Box';
import '../stories.css';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Text } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Text size="md" semantic="primary">
      Your text content here
    </Text>
  );
}
\`\`\`

A flexible Text component for displaying text content with semantic colors, typography options, and accessibility features. Perfect for body text, labels, headings, and any text-based content.

**Key Features:**
- 📏 Scale-based sizing system (3xs to 3xl) with 9 size options
- 📱 Responsive prop for auto-scaling across breakpoints (mobile: -1, tablet: base, desktop: +1)
- 🎨 Semantic color variants for consistent theming
- 🔤 Complete font weight support (thin to black)
- 📐 Text alignment options (left, center, right, justify)
- ✂️ Text truncation with ellipsis
- 🏷️ Flexible HTML element rendering (span, p, div, label, etc.)
- ♿ Full accessibility support
- 🌙 Dark mode support

**Breaking Changes:**
- ⚠️ \`variant\` prop renamed to \`size\` prop
- ⚠️ Removed variants: \`caption\`, \`overline\`, \`code\`
- ⚠️ Size scale now uses: 3xs, 2xs, xs, sm, md (default), lg, xl, 2xl, 3xl
- ✅ New \`responsive\` prop for auto-scaling text across breakpoints
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    responsive: {
      control: 'boolean',
    },
    weight: {
      control: 'select',
      options: ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
    },
    semantic: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'disabled', 'inverse', 'link', 'success', 'warning', 'error', 'accent'],
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'label', 'strong', 'em', 'small'],
    },
    italic: {
      control: 'boolean',
    },
    underline: {
      control: 'boolean',
    },
    strikethrough: {
      control: 'boolean',
    },
    truncate: {
      control: 'boolean',
    },
  },
  args: {
    size: 'md',
    responsive: false,
    weight: 'normal',
    semantic: 'primary',
    as: 'span',
    italic: false,
    underline: false,
    strikethrough: false,
    truncate: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a text component with default styling.',
  },
};

export const Sizes: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-16 story-max-width-600">
      <Text size="3xl">
        3xl - Largest text size for hero sections and display text
      </Text>
      <Text size="2xl">
        2xl - Large prominent text for page headers and headlines
      </Text>
      <Text size="xl">
        xl - Section titles and important labels
      </Text>
      <Text size="lg">
        lg - Supporting titles and subheadings
      </Text>
      <Text size="md">
        md - Default text size for main content and paragraphs
      </Text>
      <Text size="sm">
        sm - Smaller text for secondary content
      </Text>
      <Text size="xs">
        xs - Extra small text for compact layouts
      </Text>
      <Text size="2xs">
        2xs - Very small text for minimal space
      </Text>
      <Text size="3xs">
        3xs - Smallest text size available
      </Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text comes in nine different sizes from 3xs (smallest) to 3xl (largest). Each size has predefined font sizes, line heights, and weights optimized for their use case in the typography scale.'
      }
    }
  }
};

export const ResponsiveScaling: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-24">
      <Box>
        <Box marginBottom="2">
          <Text as="p" size="lg" weight="semibold">Without responsive prop:</Text>
        </Box>
        <Text size="md">
          This text stays at md size on all screen sizes. It doesn't scale with viewport changes.
        </Text>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Text as="p" size="lg" weight="semibold">With responsive prop:</Text>
        </Box>
        <Text size="md" responsive>
          This text auto-scales! Mobile: sm (-1 size), Tablet: md (base), Desktop: lg (+1 size). Resize your browser to see it change.
        </Text>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Text as="p" size="lg" weight="semibold">Responsive heading:</Text>
        </Box>
        <Text size="2xl" responsive weight="bold">
          This heading scales from xl on mobile to 2xl on tablet to 3xl on desktop
        </Text>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The responsive prop enables auto-scaling text across breakpoints. Mobile (≤639px): -1 size, Tablet (640-1024px): base size, Desktop (≥1025px): +1 size. Perfect for creating fluid typography that adapts to screen size.'
      }
    }
  }
};

export const SemanticColors: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-12">
      <Text semantic="primary">Primary text - Main content text</Text>
      <Text semantic="secondary">Secondary text - Supporting information</Text>
      <Text semantic="tertiary">Tertiary text - Less important details</Text>
      <Text semantic="disabled">Disabled text - Inactive content</Text>
      <Text semantic="link">Link text - Interactive links</Text>
      <Text semantic="success">Success text - Positive feedback</Text>
      <Text semantic="warning">Warning text - Cautionary information</Text>
      <Text semantic="error">Error text - Problem notifications</Text>
      <Text semantic="accent">Accent text - Highlighted content</Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text supports semantic color variants that automatically adjust for light and dark themes. Each semantic color communicates different meanings and states.'
      }
    }
  }
};

export const FontWeights: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-12">
      <Text weight="thin">Thin weight (100) - Very light text</Text>
      <Text weight="light">Light weight (300) - Lighter than normal</Text>
      <Text weight="normal">Normal weight (400) - Default weight</Text>
      <Text weight="medium">Medium weight (500) - Slightly heavier</Text>
      <Text weight="semibold">Semibold weight (600) - Emphasis weight</Text>
      <Text weight="bold">Bold weight (700) - Strong emphasis</Text>
      <Text weight="extrabold">Extra bold weight (800) - Very strong</Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text supports all font weight options from the design system tokens, allowing for appropriate emphasis and hierarchy.'
      }
    }
  }
};

export const TextAlignment: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-16 story-width-400">
      <Text align="left">
        Left aligned text - This text is aligned to the left side of its container.
      </Text>
      <Text align="center">
        Center aligned text - This text is centered within its container.
      </Text>
      <Text align="right">
        Right aligned text - This text is aligned to the right side of its container.
      </Text>
      <Text align="justify">
        Justified text - This longer text content will be justified to fill the entire width of the container, creating even spacing between words.
      </Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text can be aligned left, center, right, or justified within its container.'
      }
    }
  }
};

export const TextDecorations: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-12">
      <Text>Normal text without decoration</Text>
      <Text italic>Italic text for emphasis</Text>
      <Text underline>Underlined text for links</Text>
      <Text strikethrough>Strikethrough text for deletions</Text>
      <Text underline strikethrough>Combined decorations</Text>
      <Text italic weight="bold" underline>Multiple styles combined</Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text supports various decorations including italic, underline, and strikethrough. Decorations can be combined for complex styling needs.'
      }
    }
  }
};

export const TruncatedText: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-16 story-max-width-200">
      <Box>
        <Box marginBottom="2">
          <Text as="p" weight="semibold">Normal text:</Text>
        </Box>
        <Text>
          This is a very long text that would normally wrap to multiple lines in a narrow container.
        </Text>
      </Box>
      <Box>
        <Box marginBottom="2">
          <Text as="p" weight="semibold">Truncated text:</Text>
        </Box>
        <Text truncate>
          This is a very long text that would normally wrap to multiple lines in a narrow container.
        </Text>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text can be truncated with an ellipsis (...) when it overflows its container. Useful for single-line displays of potentially long content.'
      }
    }
  }
};

export const HTMLElements: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-12">
      <Text as="span">Span element (inline)</Text>
      <Text as="p">Paragraph element (block)</Text>
      <Text as="div">Div element (block)</Text>
      <Text as="label">Label element (inline)</Text>
      <Text as="strong">Strong element (inline, semantic bold)</Text>
      <Text as="em">Em element (inline, semantic emphasis)</Text>
      <Text as="small">Small element (inline, fine print)</Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text can be rendered as different HTML elements while maintaining consistent styling. Choose the appropriate semantic element for your content.'
      }
    }
  }
};

export const DarkMode: Story = {
  render: () => (
    <Box padding="6" className="story-bg-dark story-flex-column story-gap-12">
      <Text semantic="primary">Primary text in dark mode</Text>
      <Text semantic="secondary">Secondary text in dark mode</Text>
      <Text semantic="tertiary">Tertiary text in dark mode</Text>
      <Text semantic="success">Success text in dark mode</Text>
      <Text semantic="warning">Warning text in dark mode</Text>
      <Text semantic="error">Error text in dark mode</Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text automatically adapts its colors for dark mode when is true. Semantic colors are automatically adjusted for optimal contrast.'
      }
    }
  }
};

export const RealWorldExample: Story = {
  render: () => (
    <Box className="story-max-width-600 story-flex-column story-gap-16">
      <Text size="xs" semantic="tertiary" weight="semibold">ARTICLE</Text>
      <Text as="div" size="xl" weight="bold" semantic="primary">
        Design System Best Practices
      </Text>
      <Box marginBottom="4">
        <Text size="sm" semantic="secondary">
          Published on March 15, 2024 by Design Team
        </Text>
      </Box>
      <Text size="md" semantic="primary">
        A well-designed design system serves as the foundation for consistent,
        scalable user experiences across all product touchpoints. This article
        explores the fundamental principles that make design systems effective.
      </Text>
      <Text size="xs" semantic="tertiary">
        <Text as="span" italic>Reading time: 5 minutes</Text>
      </Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how Text components work together to create a complete content hierarchy with proper semantic meaning and visual distinction.'
      }
    }
  }
};

/**
 * Inverse semantic variant for text on contrasting backgrounds
 * - Light mode: white text for dark backgrounds
 * - Dark mode: black text for light backgrounds
 */
export const InverseVariant: Story = {
  args: { children: "" },
  render: () => (
    <>
      <style>{`
        .inverse-demo-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .inverse-demo-dark-gray {
          background: #2d3748;
        }
        .inverse-demo-darker {
          background: #1a202c;
        }
      `}</style>
      <Box display="flex" flexDirection="column" gap="lg">
        {/* Dark background example */}
        <Box padding="6" corners="rounded-lg" className="inverse-demo-gradient">
          <Box marginBottom="4">
            <Text size="2xl" semantic="inverse" weight="bold">
              Inverse Text on Dark Background
            </Text>
          </Box>
          <Box marginBottom="3">
            <Text size="xl" semantic="inverse">
              Perfect for hero sections and cards
            </Text>
          </Box>
          <Text size="md" semantic="inverse">
            The inverse semantic automatically uses white text in light mode and black text in dark mode,
            ensuring optimal contrast on opposite-colored backgrounds.
          </Text>
        </Box>

        {/* Comparison with normal text */}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="md">
          <Box padding="6" border="default" corners="rounded-lg">
            <Box marginBottom="3">
              <Text size="xl" semantic="primary" weight="semibold">
                Normal Text
              </Text>
            </Box>
            <Text size="md" semantic="primary">
              Uses primary semantic colors - dark text in light mode, light text in dark mode.
            </Text>
          </Box>

          <Box padding="6" corners="rounded-lg" className="inverse-demo-dark-gray">
            <Box marginBottom="3">
              <Text size="xl" semantic="inverse" weight="semibold">
                Inverse Text
              </Text>
            </Box>
            <Text size="md" semantic="inverse">
              Uses inverse colors - white text in light mode, black text in dark mode.
            </Text>
          </Box>
        </Box>

        {/* All semantic variants on dark background */}
        <Box padding="6" corners="rounded-lg" className="inverse-demo-darker">
          <Box marginBottom="4">
            <Text size="xl" semantic="inverse" weight="bold">
              Semantic Variants on Dark Background
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap="sm">
            <Text semantic="primary">Primary: (not ideal on dark)</Text>
            <Text semantic="secondary">Secondary: (not ideal on dark)</Text>
            <Text semantic="inverse">Inverse: Perfect for dark backgrounds!</Text>
            <Text semantic="success">Success: Works on dark</Text>
            <Text semantic="error">Error: Works on dark</Text>
          </Box>
        </Box>
      </Box>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The inverse semantic variant automatically swaps between white and black text based on theme mode, making it ideal for text on contrasting backgrounds like dark cards or hero sections.'
      }
    }
  }
};