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
    <Text variant="body" semantic="primary">
      Your text content here
    </Text>
  );
}
\`\`\`

A flexible Text component for displaying text content with semantic variants, typography options, and accessibility features. Perfect for body text, captions, labels, and any text-based content.

**Key Features:**
- 📝 Eleven text variants (display, headline, title, subtitle, body, body-sm, body-xs, body-xxs, caption, overline, code)
- 🎨 Semantic color variants for consistent theming
- 🔤 Complete font weight support (thin to black)
- 📐 Text alignment options (left, center, right, justify)
- ✂️ Text truncation with ellipsis
- 🏷️ Flexible HTML element rendering (span, p, div, label, etc.)
- ♿ Full accessibility support
- 🌙 Dark mode support

**Breaking Changes:**
- ⚠️ Removed \`body-lg\` and \`body-md\` variants - use \`body\` instead
- ⚠️ Default variant changed from \`body-md\` to \`body\`
- ✅ New variants added: \`display\`, \`headline\`, \`title\`, \`subtitle\`, \`code\`
- ✅ New semantic color: \`accent\`
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'headline', 'title', 'subtitle', 'body', 'body-sm', 'body-xs', 'body-xxs', 'caption', 'overline', 'code'],
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
    variant: 'body',
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

export const Variants: Story = {
  render: () => (
    <Box className="story-flex-column story-gap-16 story-max-width-600">
      <Text variant="display">
        Display text - Largest text variant for hero sections
      </Text>
      <Text variant="headline">
        Headline text - Large prominent text for page headers
      </Text>
      <Text variant="title">
        Title text - Section titles and important labels
      </Text>
      <Text variant="subtitle">
        Subtitle text - Supporting titles and subheadings
      </Text>
      <Text variant="body">
        Body text - Default text for main content and paragraphs
      </Text>
      <Text variant="body-sm">
        Small body text - Smaller text for secondary content
      </Text>
      <Text variant="body-xs">
        Extra small body text - Even smaller text for compact layouts
      </Text>
      <Text variant="body-xxs">
        Tiny body text - Smallest body text for minimal space
      </Text>
      <Text variant="caption">
        Caption text - Small descriptive text for labels and captions
      </Text>
      <Text variant="overline">
        Overline text - Used for section headers
      </Text>
      <Text variant="code">
        Code text - Monospace text for code snippets
      </Text>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text comes in eleven different variants: display, headline, title, subtitle, body, body-sm, body-xs, body-xxs, caption, overline, and code. Each variant has predefined font sizes and line heights optimized for their use case.'
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
      <Text variant="overline" semantic="tertiary">ARTICLE</Text>
      <Text as="div" variant="title" weight="bold" semantic="primary">
        Design System Best Practices
      </Text>
      <Box marginBottom="4">
        <Text variant="body-sm" semantic="secondary">
          Published on March 15, 2024 by Design Team
        </Text>
      </Box>
      <Text variant="body" semantic="primary">
        A well-designed design system serves as the foundation for consistent,
        scalable user experiences across all product touchpoints. This article
        explores the fundamental principles that make design systems effective.
      </Text>
      <Text variant="caption" semantic="tertiary">
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