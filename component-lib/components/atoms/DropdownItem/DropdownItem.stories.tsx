import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownItem } from './DropdownItem';

const meta = {
  title: 'Atoms/DropdownItem',
  component: DropdownItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A single dropdown menu item component. Part of the atomic design system - used internally by the Dropdown component to render individual options.'
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Unique value for the dropdown item'
    },
    label: {
      control: 'text',
      description: 'Display label for the dropdown item'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the item is disabled'
    },
    divider: {
      control: 'boolean',
      description: 'Whether to render as a divider instead of a regular item'
    },
    hasChildren: {
      control: 'boolean',
      description: 'Whether this item has nested children (shows expansion indicator)'
    },
    depth: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Nesting depth for indentation'
    },
    focused: {
      control: 'boolean',
      description: 'Whether this item is currently focused'
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Dark mode support'
    },
    expansionIndicator: {
      control: 'text',
      description: 'Custom expansion indicator for items with children'
    }
  },
  args: {
    value: 'item-1',
    label: 'Dropdown Item',
    disabled: false,
    divider: false,
    hasChildren: false,
    depth: 0,
    focused: false,
    isDarkMode: false
  }
} satisfies Meta<typeof DropdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Item'
  }
};

export const WithIcon: Story = {
  args: {
    label: 'With Icon',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path 
          d="M2 4h12M2 8h12M2 12h12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    )
  }
};

export const HasChildren: Story = {
  args: {
    label: 'Parent Item',
    hasChildren: true
  }
};

export const CustomExpansionIndicator: Story = {
  args: {
    label: 'Custom Indicator',
    hasChildren: true,
    expansionIndicator: '→'
  }
};

export const Focused: Story = {
  args: {
    label: 'Focused Item',
    focused: true
  }
};

export const Divider: Story = {
  args: {
    divider: true
  }
};

export const NestedLevels: Story = {
  render: (args) => (
    <div style={{ width: '200px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
      <DropdownItem
        {...args}
        label="Level 0"
        depth={0}
        value="level-0"
      />
      <DropdownItem
        {...args}
        label="Level 1"
        depth={1}
        value="level-1"
      />
      <DropdownItem
        {...args}
        label="Level 2"
        depth={2}
        value="level-2"
      />
      <DropdownItem
        {...args}
        label="Level 3"
        depth={3}
        value="level-3"
      />
    </div>
  )
};

export const CompleteDropdownMenu: Story = {
  render: (args) => (
    <div style={{ width: '240px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
      <DropdownItem
        {...args}
        label="File"
        value="file"
        hasChildren={true}
        icon={<span>📁</span>}
      />
      <DropdownItem
        {...args}
        label="New File"
        value="new-file"
        depth={1}
        icon={<span>📄</span>}
      />
      <DropdownItem
        {...args}
        label="New Folder"
        value="new-folder"
        depth={1}
        icon={<span>📁</span>}
      />
      <DropdownItem divider value="divider" label="" />
      <DropdownItem
        {...args}
        label="Edit"
        value="edit"
        icon={<span>✏️</span>}
      />
      <DropdownItem
        {...args}
        label="Delete"
        value="delete"
        icon={<span>🗑️</span>}
        disabled={true}
      />
      <DropdownItem divider value="divider" label="" />
      <DropdownItem
        {...args}
        label="Settings"
        value="settings"
        hasChildren={true}
        icon={<span>⚙️</span>}
      />
      <DropdownItem
        {...args}
        label="Theme"
        value="theme"
        depth={1}
        focused={true}
      />
      <DropdownItem
        {...args}
        label="Language"
        value="language"
        depth={1}
      />
    </div>
  )
};

export const DarkMode: Story = {
  args: {
    isDarkMode: true,
    label: 'Dark Mode Item',
    icon: <span>🌙</span>
  },
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

export const LongLabel: Story = {
  args: {
    label: 'This is a very long dropdown item label that might overflow',
    value: 'long-label'
  }
};

export const EmojiIcon: Story = {
  args: {
    label: 'With Emoji',
    icon: <span style={{ fontSize: '16px' }}>🎯</span>,
    value: 'emoji-item'
  }
};

export const InteractiveDemo: Story = {
  render: (args) => {
    const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
    
    return (
      <div>
        <p style={{ marginBottom: '16px', fontSize: '14px' }}>
          Selected: <strong>{selectedItem || 'None'}</strong> | 
          Hovered: <strong>{hoveredItem || 'None'}</strong>
        </p>
        <div style={{ width: '200px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }}>
          <DropdownItem
            {...args}
            label="Option 1"
            value="option-1"
            focused={hoveredItem === 'option-1'}
            onSelect={setSelectedItem}
            onMouseEnter={setHoveredItem}
          />
          <DropdownItem
            {...args}
            label="Option 2"
            value="option-2"
            focused={hoveredItem === 'option-2'}
            onSelect={setSelectedItem}
            onMouseEnter={setHoveredItem}
            icon={<span>⭐</span>}
          />
          <DropdownItem divider value="divider" label="" />
          <DropdownItem
            {...args}
            label="Disabled Option"
            value="disabled"
            disabled={true}
            onSelect={setSelectedItem}
            onMouseEnter={setHoveredItem}
          />
        </div>
      </div>
    );
  }
};