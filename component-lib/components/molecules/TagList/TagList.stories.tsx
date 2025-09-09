import type { Meta, StoryObj } from '@storybook/react';
import { TagList } from './TagList';
import { TagData } from './TagList';

const meta: Meta<typeof TagList> = {
  title: 'Molecules/TagList',
  component: TagList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A collection of Tag components that can be managed as a group. Supports filtering, removal, and custom styling.',
      },
    },
  },
  argTypes: {
    tags: {
      description: 'Array of tag data to render',
      control: 'object',
    },
    variant: {
      description: 'Default variant for all tags',
      control: 'select',
      options: ['filled', 'outlined', 'ghost'],
    },
    semantic: {
      description: 'Default semantic type for all tags',
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      description: 'Default size for all tags',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    gap: {
      description: 'Gap between tags',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    maxRows: {
      description: 'Maximum number of rows before hiding overflow',
      control: 'number',
    },
    showOverflow: {
      description: 'Show count of hidden tags when maxRows is exceeded',
      control: 'boolean',
    },
    removable: {
      description: 'Whether tags are removable by default',
      control: 'boolean',
    },
    disabled: {
      description: 'Whether tags are disabled by default',
      control: 'boolean',
    },
    isDarkMode: {
      description: 'Dark mode styling',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TagList>;

// Sample tag data
const basicTags: TagData[] = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'JavaScript' },
  { id: '4', label: 'Node.js' },
  { id: '5', label: 'GraphQL' },
];

const skillTags: TagData[] = [
  { id: '1', label: 'Frontend', semantic: 'primary' },
  { id: '2', label: 'Backend', semantic: 'success' },
  { id: '3', label: 'DevOps', semantic: 'warning' },
  { id: '4', label: 'Design', semantic: 'info' },
  { id: '5', label: 'Legacy', semantic: 'error' },
];

const removableTags: TagData[] = [
  { id: '1', label: 'Tag 1', removable: true },
  { id: '2', label: 'Tag 2', removable: true },
  { id: '3', label: 'Tag 3', removable: true },
  { id: '4', label: 'Tag 4', removable: true },
];

const mixedTags: TagData[] = [
  { id: '1', label: 'React', variant: 'filled', semantic: 'primary', icon: '⚛️' },
  { id: '2', label: 'TypeScript', variant: 'outlined', semantic: 'info', removable: true },
  { id: '3', label: 'Deprecated', variant: 'ghost', semantic: 'error', disabled: true },
  { id: '4', label: 'New Feature', variant: 'filled', semantic: 'success', removable: true },
  { id: '5', label: 'Beta', variant: 'outlined', semantic: 'warning', icon: '🚧' },
];

const manyTags: TagData[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i}`,
  label: `Technology ${i + 1}`,
  semantic: ['default', 'primary', 'success', 'warning', 'error', 'info'][i % 6] as TagData['semantic'],
  removable: i % 3 === 0,
}));

export const Default: Story = {
  args: {
    tags: basicTags,
  },
};

export const WithVariants: Story = {
  args: {
    tags: [
      { id: '1', label: 'Filled', variant: 'filled' },
      { id: '2', label: 'Outlined', variant: 'outlined' },
      { id: '3', label: 'Ghost', variant: 'ghost' },
    ],
  },
};

export const SemanticColors: Story = {
  args: {
    tags: skillTags,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Small</h4>
        <TagList tags={basicTags} size="sm" />
      </div>
      <div>
        <h4>Medium (Default)</h4>
        <TagList tags={basicTags} size="md" />
      </div>
      <div>
        <h4>Large</h4>
        <TagList tags={basicTags} size="lg" />
      </div>
    </div>
  ),
};

export const Removable: Story = {
  args: {
    tags: removableTags,
    onRemove: (tagId) => console.log(`Removed tag: ${tagId}`),
  },
};

export const Clickable: Story = {
  args: {
    tags: basicTags,
    onTagClick: (tagId) => console.log(`Clicked tag: ${tagId}`),
  },
};

export const Mixed: Story = {
  args: {
    tags: mixedTags,
    onRemove: (tagId) => console.log(`Removed tag: ${tagId}`),
    onTagClick: (tagId) => console.log(`Clicked tag: ${tagId}`),
  },
};

export const WithGaps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4>Extra Small Gap</h4>
        <TagList tags={basicTags} gap="xs" />
      </div>
      <div>
        <h4>Small Gap (Default)</h4>
        <TagList tags={basicTags} gap="sm" />
      </div>
      <div>
        <h4>Medium Gap</h4>
        <TagList tags={basicTags} gap="md" />
      </div>
      <div>
        <h4>Large Gap</h4>
        <TagList tags={basicTags} gap="lg" />
      </div>
    </div>
  ),
};

export const MaxRowsWithOverflow: Story = {
  args: {
    tags: manyTags,
    maxRows: 2,
    showOverflow: true,
  },
};

export const EmptyState: Story = {
  args: {
    tags: [],
    emptyState: 'No tags to display',
  },
};

export const DarkMode: Story = {
  args: {
    tags: mixedTags,
    isDarkMode: true,
    onRemove: (tagId) => console.log(`Removed tag: ${tagId}`),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LongContent: Story = {
  args: {
    tags: [
      { id: '1', label: 'This is a very long tag label that might wrap' },
      { id: '2', label: 'Short' },
      { id: '3', label: 'Another extremely long tag that demonstrates text handling' },
      { id: '4', label: 'Medium length tag' },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    tags: [
      { id: '1', label: 'React', icon: '⚛️' },
      { id: '2', label: 'TypeScript', icon: '🔷' },
      { id: '3', label: 'Node.js', icon: '🟢' },
      { id: '4', label: 'GraphQL', icon: '🌸' },
      { id: '5', label: 'Docker', icon: '🐳' },
    ],
  },
};

export const Playground: Story = {
  args: {
    tags: mixedTags,
    variant: 'filled',
    semantic: 'default',
    size: 'md',
    gap: 'sm',
    removable: false,
    disabled: false,
    isDarkMode: false,
    showOverflow: true,
    maxRows: 3,
    onRemove: (tagId) => console.log(`Removed tag: ${tagId}`),
    onTagClick: (tagId) => console.log(`Clicked tag: ${tagId}`),
  },
};