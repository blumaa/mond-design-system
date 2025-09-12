import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Tag',
  component: Tag,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Tag } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <div>
      <Tag>Default Tag</Tag>
      <Tag variant="outlined" semantic="primary">
        Primary Tag
      </Tag>
      <Tag removable onRemove={() => console.log('removed')}>
        Removable Tag
      </Tag>
    </div>
  );
}
\`\`\`

A versatile tag/chip component for displaying labels, categories, status indicators, and removable items. Supports multiple variants, semantic colors, and interactive features.

**Key Features:**
- 🎨 Three visual variants (filled, outlined, ghost)
- 🌈 Six semantic colors (default, primary, success, warning, error, info)
- 📏 Three sizes (sm, md, lg) for different contexts
- ❌ Removable functionality with onRemove callback
- 🎯 Icon support for enhanced meaning
- 🚫 Disabled state handling
- 🌙 Automatic dark mode adaptation
- ♿ Full accessibility support
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The content of the tag',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'ghost'],
      description: 'Visual style variant',
    },
    semantic: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'Semantic color variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    removable: {
      control: 'boolean',
      description: 'Whether the tag can be removed',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tag is disabled',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    icon: {
      control: false,
      description: 'Optional icon to display',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Tag',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tag variant="filled">Filled</Tag>
      <Tag variant="outlined">Outlined</Tag>
      <Tag variant="ghost">Ghost</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three visual variants: filled (solid background), outlined (border only), and ghost (subtle background).',
      },
    },
  },
};

export const SemanticVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tag semantic="default">Default</Tag>
        <Tag semantic="primary">Primary</Tag>
        <Tag semantic="success">Success</Tag>
        <Tag semantic="warning">Warning</Tag>
        <Tag semantic="error">Error</Tag>
        <Tag semantic="info">Info</Tag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic variants provide meaningful colors for different contexts and states.',
      },
    },
  },
};

export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {['filled', 'outlined', 'ghost'].map(variant => (
        <div key={variant}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
            {variant} Variant
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {['default', 'primary', 'success', 'warning', 'error', 'info'].map(semantic => (
              <Tag key={semantic} variant={variant as 'filled' | 'outlined' | 'ghost'} semantic={semantic as 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'}>
                {semantic}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All combinations of variants and semantic colors.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Three size options: small (24px), medium (28px), and large (36px) heights.',
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Tag 
        semantic="success" 
        icon={
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Completed
      </Tag>
      
      <Tag 
        semantic="warning" 
        icon={
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8H6.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Warning
      </Tag>
      
      <Tag 
        semantic="info" 
        icon={
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 8V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 4H6.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Information
      </Tag>
      
      <Tag 
        semantic="primary" 
        size="lg"
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      >
        Add New
      </Tag>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tags can include icons to provide additional visual context. Icon size adjusts automatically with tag size.',
      },
    },
  },
};

export const RemovableTags: Story = {
  render: () => {
    const tags = ['React', 'TypeScript', 'Storybook', 'Design System'];
    
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <Tag 
            key={tag} 
            removable 
            onRemove={() => alert(`Removing ${tag}`)}
            semantic={tag === 'React' ? 'primary' : tag === 'TypeScript' ? 'info' : 'default'}
          >
            {tag}
          </Tag>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Removable tags include a close button. Click the × to trigger the onRemove callback.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tag disabled>Disabled Default</Tag>
        <Tag disabled semantic="primary">Disabled Primary</Tag>
        <Tag disabled semantic="success">Disabled Success</Tag>
        <Tag disabled variant="outlined" semantic="error">Disabled Error</Tag>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tag disabled removable onRemove={() => {}}>Disabled Removable</Tag>
        <Tag 
          disabled 
          removable 
          semantic="primary" 
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          onRemove={() => {}}
        >
          Disabled with Icon
        </Tag>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled tags have reduced opacity and non-interactive remove buttons.',
      },
    },
  },
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#ffffff', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        minWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>Light Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag  semantic="default">Default</Tag>
            <Tag  semantic="primary">Primary</Tag>
            <Tag  semantic="success">Success</Tag>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag  variant="outlined" semantic="warning">Warning</Tag>
            <Tag  variant="outlined" semantic="error">Error</Tag>
            <Tag  variant="ghost" semantic="info">Info</Tag>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        color: '#f9fafb',
        minWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 16px 0', textAlign: 'center', color: '#f9fafb' }}>Dark Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag  semantic="default">Default</Tag>
            <Tag  semantic="primary">Primary</Tag>
            <Tag  semantic="success">Success</Tag>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Tag  variant="outlined" semantic="warning">Warning</Tag>
            <Tag  variant="outlined" semantic="error">Error</Tag>
            <Tag  variant="ghost" semantic="info">Info</Tag>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tags automatically adapt to light and dark themes with appropriate color adjustments.',
      },
    },
  },
};

export const UseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Status Indicators</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Tag semantic="success" size="sm">Active</Tag>
          <Tag semantic="warning" size="sm">Pending</Tag>
          <Tag semantic="error" size="sm">Inactive</Tag>
          <Tag semantic="default" size="sm">Draft</Tag>
        </div>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Category Tags</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Tag variant="outlined">Frontend</Tag>
          <Tag variant="outlined">Backend</Tag>
          <Tag variant="outlined">Design</Tag>
          <Tag variant="outlined">DevOps</Tag>
        </div>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Skill Tags (Removable)</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Tag variant="ghost" removable onRemove={() => alert('Remove JavaScript')}>JavaScript</Tag>
          <Tag variant="ghost" removable onRemove={() => alert('Remove React')}>React</Tag>
          <Tag variant="ghost" removable onRemove={() => alert('Remove TypeScript')}>TypeScript</Tag>
          <Tag variant="ghost" removable onRemove={() => alert('Remove Node.js')}>Node.js</Tag>
        </div>
      </div>
      
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Priority Levels</h4>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Tag 
            semantic="error" 
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L11 10H1L6 1Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            }
          >
            High
          </Tag>
          <Tag 
            semantic="warning"
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            }
          >
            Medium
          </Tag>
          <Tag 
            semantic="default"
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 8V6M6 4H6.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
          >
            Low
          </Tag>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common use cases for tags: status indicators, categories, removable skills, and priority levels.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Custom Tag',
    variant: 'filled',
    semantic: 'default',
    size: 'md',
    removable: false,
    disabled: false,
    isDarkMode: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different tag configurations.',
      },
    },
  },
};