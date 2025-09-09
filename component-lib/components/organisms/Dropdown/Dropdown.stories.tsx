import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Organisms/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Dropdown, Button } from '@mond-design-system/theme';

function MyComponent() {
  const options = [
    { value: 'edit', label: 'Edit', icon: '✏️' },
    { value: 'duplicate', label: 'Duplicate', icon: '📋' },
    { value: 'archive', label: 'Archive', icon: '📦' },
    { value: 'divider', label: '', divider: true },
    { value: 'delete', label: 'Delete', icon: '🗑️' },
  ];

  const handleSelect = (value: string, option: any) => {
    console.log('Selected:', value, option);
  };

  return (
    <Dropdown
      options={options}
      trigger={<Button variant="outline">Actions</Button>}
      onSelect={handleSelect}
      placement="bottom-start"
    />
  );
}
\`\`\`

Dropdown is an organism component that provides a customizable dropdown menu with support for icons, nested items, dividers, and various trigger elements. Built using DropdownItem atoms and supporting complex menu structures.

**Key Features:**
- 🎯 Flexible trigger element (buttons, text, custom components)
- 📁 Nested menu support with sub-items
- 🎨 Icons and custom content in menu items
- ➖ Divider support for menu organization
- 📐 Multiple placement options (top, bottom, start, end)
- 🚫 Disabled items and conditional rendering
- 🎭 Dark mode compatibility
- ♿ Full accessibility with keyboard navigation
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    closeOnSelect: {
      control: 'boolean',
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicOptions = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete' },
];

const optionsWithIcons = [
  { value: 'profile', label: 'Profile', icon: '👤' },
  { value: 'settings', label: 'Settings', icon: '⚙️' },
  { value: 'help', label: 'Help & Support', icon: '❓' },
  { value: 'divider', label: '', divider: true },
  { value: 'logout', label: 'Logout', icon: '🚪' },
];

const nestedOptions = [
  {
    value: 'file',
    label: 'File',
    icon: '📁',
    children: [
      { value: 'new', label: 'New File', icon: '📄' },
      { value: 'open', label: 'Open', icon: '📂' },
      { value: 'recent', label: 'Recent Files', icon: '🕐' },
      { value: 'divider1', label: '', divider: true },
      { value: 'save', label: 'Save', icon: '💾' },
      { value: 'save-as', label: 'Save As...', icon: '💾' },
    ]
  },
  {
    value: 'edit',
    label: 'Edit',
    icon: '✏️',
    children: [
      { value: 'undo', label: 'Undo', icon: '↶' },
      { value: 'redo', label: 'Redo', icon: '↷' },
      { value: 'divider2', label: '', divider: true },
      { value: 'cut', label: 'Cut', icon: '✂️' },
      { value: 'copy', label: 'Copy', icon: '📋' },
      { value: 'paste', label: 'Paste', icon: '📌' },
    ]
  },
  { value: 'view', label: 'View', icon: '👁️' },
];

export const Default: Story = {
  render: () => (
    <Dropdown
      options={basicOptions}
      trigger={<Button variant="outline">Actions</Button>}
      onSelect={(value, option) => console.log('Selected:', value, option)}
    />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown
      options={optionsWithIcons}
      trigger={<Button variant="outline">Account Menu</Button>}
      onSelect={(value, option) => console.log('Selected:', value, option)}
    />
  ),
};

export const NestedMenu: Story = {
  render: () => (
    <Dropdown
      options={nestedOptions}
      trigger={<Button variant="outline">Menu</Button>}
      onSelect={(value, option) => console.log('Selected:', value, option)}
      closeOnSelect={false}
    />
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem',
      padding: '4rem',
      minHeight: '400px'
    }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Bottom Start</h3>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="outline">Bottom Start</Button>}
          placement="bottom-start"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Bottom End</h3>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="outline">Bottom End</Button>}
          placement="bottom-end"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Top Start</h3>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="outline">Top Start</Button>}
          placement="top-start"
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Top End</h3>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="outline">Top End</Button>}
          placement="top-end"
        />
      </div>
    </div>
  ),
};

export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled = [
      { value: 'edit', label: 'Edit', icon: '✏️' },
      { value: 'duplicate', label: 'Duplicate', icon: '📋' },
      { value: 'move', label: 'Move to...', icon: '📁', disabled: true },
      { value: 'divider', label: '', divider: true },
      { value: 'archive', label: 'Archive', icon: '📦' },
      { value: 'delete', label: 'Delete', icon: '🗑️', disabled: true },
    ];
    
    return (
      <Dropdown
        options={optionsWithDisabled}
        trigger={<Button variant="outline">Actions</Button>}
        onSelect={(value, option) => console.log('Selected:', value, option)}
      />
    );
  },
};

export const ControlledDropdown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="outline">Controlled Menu {isOpen ? '▲' : '▼'}</Button>}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSelect={(value) => {
            setSelectedValue(value);
            setIsOpen(false);
          }}
        />
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          Open: {isOpen ? 'Yes' : 'No'} | Selected: {selectedValue || 'None'}
        </div>
        
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Menu Programmatically
        </Button>
      </div>
    );
  },
};

export const PersistentMenu: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    const toggleSelection = (value: string) => {
      setSelectedItems(prev => 
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    };
    
    const checkboxOptions = [
      { value: 'notifications', label: '📧 Email notifications' },
      { value: 'updates', label: '🔄 Product updates' },
      { value: 'marketing', label: '📢 Marketing emails' },
      { value: 'newsletter', label: '📰 Weekly newsletter' },
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <Dropdown
          options={checkboxOptions}
          trigger={<Button variant="outline">Notification Settings</Button>}
          closeOnSelect={false}
          onSelect={(value) => toggleSelection(value)}
        />
        
        <div style={{ fontSize: '14px', color: '#666' }}>
          Selected: {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'}
        </div>
      </div>
    );
  },
};

export const CustomTriggers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Button Trigger</h3>
        <Dropdown
          options={basicOptions}
          trigger={<Button variant="primary">Primary Button</Button>}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Custom Trigger</h3>
        <Dropdown
          options={optionsWithIcons}
          trigger={
            <div style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👤</span>
              <span>John Doe</span>
              <span>▼</span>
            </div>
          }
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Text Trigger</h3>
        <Dropdown
          options={basicOptions}
          trigger={
            <span style={{
              color: '#0066cc',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Click for options
            </span>
          }
        />
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>User Profile Menu</h3>
        <Dropdown
          options={[
            { value: 'profile', label: 'View Profile', icon: '👤' },
            { value: 'settings', label: 'Account Settings', icon: '⚙️' },
            { value: 'billing', label: 'Billing & Plans', icon: '💳' },
            { value: 'divider1', label: '', divider: true },
            { value: 'help', label: 'Help Center', icon: '❓' },
            { value: 'feedback', label: 'Send Feedback', icon: '💬' },
            { value: 'divider2', label: '', divider: true },
            { value: 'logout', label: 'Sign Out', icon: '🚪' },
          ]}
          trigger={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: 'white'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4f46e5',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600
              }}>
                JD
              </div>
              <span>John Doe</span>
              <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
            </div>
          }
          placement="bottom-end"
          onSelect={(value) => console.log('Profile action:', value)}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 600 }}>Table Actions</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <div>
            <strong>Project Alpha</strong>
            <div style={{ fontSize: '14px', color: '#666' }}>Last updated 2 hours ago</div>
          </div>
          <Dropdown
            options={[
              { value: 'edit', label: 'Edit Project', icon: '✏️' },
              { value: 'duplicate', label: 'Duplicate', icon: '📋' },
              { value: 'export', label: 'Export Data', icon: '📤' },
              { value: 'divider', label: '', divider: true },
              { value: 'archive', label: 'Archive', icon: '📦' },
              { value: 'delete', label: 'Delete', icon: '🗑️' },
            ]}
            trigger={<Button variant="ghost" size="sm">⋮</Button>}
            placement="bottom-end"
            onSelect={(value) => console.log('Project action:', value)}
          />
        </div>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div style={{
      backgroundColor: '#1a1a1a',
      padding: '2rem',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '16px', 
          fontWeight: 600,
          color: 'white'
        }}>
          Dark Mode Dropdown
        </h3>
        <Dropdown
          options={optionsWithIcons}
          trigger={<Button variant="outline" isDarkMode>Account Menu</Button>}
          isDarkMode
          onSelect={(value, option) => console.log('Selected:', value, option)}
        />
      </div>
      
      <div>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '16px', 
          fontWeight: 600,
          color: 'white'
        }}>
          Nested Menu in Dark Mode
        </h3>
        <Dropdown
          options={nestedOptions}
          trigger={<Button variant="primary" isDarkMode>File Menu</Button>}
          isDarkMode
          closeOnSelect={false}
          onSelect={(value, option) => console.log('Selected:', value, option)}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const Playground: Story = {
  args: {
    options: basicOptions,
    placement: 'bottom-start',
    closeOnSelect: true,
    isDarkMode: false,
  },
  render: (args) => (
    <Dropdown
      {...args}
      trigger={<Button variant="outline">Playground Menu</Button>}
      onSelect={(value, option) => console.log('Selected:', value, option)}
    />
  ),
};