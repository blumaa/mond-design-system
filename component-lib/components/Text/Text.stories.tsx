import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

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
    <Text variant="body-md" semantic="primary">
      Your text content here
    </Text>
  );
}
\`\`\`

A flexible Text component for displaying text content with semantic variants, typography options, and accessibility features. Perfect for body text, captions, labels, and any text-based content.

**Key Features:**
- 📝 Five text variants (body-lg, body-md, body-sm, caption, overline)
- 🎨 Semantic color variants for consistent theming
- 🔤 Complete font weight support (thin to black)
- 📐 Text alignment options (left, center, right, justify)
- ✂️ Text truncation with ellipsis
- 🏷️ Flexible HTML element rendering (span, p, div, label, etc.)
- ♿ Full accessibility support
- 🌙 Dark mode support
`
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body-lg', 'body-md', 'body-sm', 'caption', 'overline'],
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
      options: ['primary', 'secondary', 'tertiary', 'disabled', 'inverse', 'link', 'success', 'warning', 'error'],
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
    isDarkMode: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'body-md',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Text variant="body-lg">
        Large body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      <Text variant="body-md">
        Medium body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      <Text variant="body-sm">
        Small body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Text>
      <Text variant="caption">
        Caption text - Small descriptive text for labels and captions.
      </Text>
      <Text variant="overline">
        Overline text - Used for section headers
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text comes in five different variants: body-lg, body-md, body-sm, caption, and overline. Each variant has predefined font sizes and line heights optimized for their use case.'
      }
    }
  }
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text semantic="primary">Primary text - Main content text</Text>
      <Text semantic="secondary">Secondary text - Supporting information</Text>
      <Text semantic="tertiary">Tertiary text - Less important details</Text>
      <Text semantic="disabled">Disabled text - Inactive content</Text>
      <Text semantic="link">Link text - Interactive links</Text>
      <Text semantic="success">Success text - Positive feedback</Text>
      <Text semantic="warning">Warning text - Cautionary information</Text>
      <Text semantic="error">Error text - Problem notifications</Text>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text weight="thin">Thin weight (100) - Very light text</Text>
      <Text weight="light">Light weight (300) - Lighter than normal</Text>
      <Text weight="normal">Normal weight (400) - Default weight</Text>
      <Text weight="medium">Medium weight (500) - Slightly heavier</Text>
      <Text weight="semibold">Semibold weight (600) - Emphasis weight</Text>
      <Text weight="bold">Bold weight (700) - Strong emphasis</Text>
      <Text weight="extrabold">Extra bold weight (800) - Very strong</Text>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
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
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text>Normal text without decoration</Text>
      <Text italic>Italic text for emphasis</Text>
      <Text underline>Underlined text for links</Text>
      <Text strikethrough>Strikethrough text for deletions</Text>
      <Text underline strikethrough>Combined decorations</Text>
      <Text italic weight="bold" underline>Multiple styles combined</Text>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <div>
        <Text as="p" style={{ marginBottom: '8px', fontWeight: '600' }}>Normal text:</Text>
        <Text>
          This is a very long text that would normally wrap to multiple lines in a narrow container.
        </Text>
      </div>
      <div>
        <Text as="p" style={{ marginBottom: '8px', fontWeight: '600' }}>Truncated text:</Text>
        <Text truncate>
          This is a very long text that would normally wrap to multiple lines in a narrow container.
        </Text>
      </div>
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text as="span">Span element (inline)</Text>
      <Text as="p">Paragraph element (block)</Text>
      <Text as="div">Div element (block)</Text>
      <Text as="label">Label element (inline)</Text>
      <Text as="strong">Strong element (inline, semantic bold)</Text>
      <Text as="em">Em element (inline, semantic emphasis)</Text>
      <Text as="small">Small element (inline, fine print)</Text>
    </div>
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
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      color: '#ffffff', 
      padding: '24px', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <Text semantic="primary">Primary text in dark mode</Text>
      <Text semantic="secondary">Secondary text in dark mode</Text>
      <Text semantic="tertiary">Tertiary text in dark mode</Text>
      <Text semantic="success">Success text in dark mode</Text>
      <Text semantic="warning">Warning text in dark mode</Text>
      <Text semantic="error">Error text in dark mode</Text>
    </div>
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
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="overline" semantic="tertiary">ARTICLE</Text>
      <Text as="div" variant="body-lg" weight="bold" semantic="primary">
        Design System Best Practices
      </Text>
      <Text semantic="secondary" style={{ marginBottom: '16px' }}>
        Published on March 15, 2024 by Design Team
      </Text>
      <Text variant="body-md" semantic="primary">
        A well-designed design system serves as the foundation for consistent, 
        scalable user experiences across all product touchpoints. This article 
        explores the fundamental principles that make design systems effective.
      </Text>
      <Text variant="body-sm" semantic="tertiary">
        <Text as="span" italic>Reading time: 5 minutes</Text>
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how Text components work together to create a complete content hierarchy with proper semantic meaning and visual distinction.'
      }
    }
  }
};