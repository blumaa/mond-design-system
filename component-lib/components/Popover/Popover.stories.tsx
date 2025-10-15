import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { useState } from 'react';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Popover, Button } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Popover
      content={
        <div>
          <h4>User Actions</h4>
          <button>Edit Profile</button>
          <button>Settings</button>
          <button>Logout</button>
        </div>
      }
      placement="bottom-start"
    >
      <Button>Open Menu</Button>
    </Popover>
  );
}
\`\`\`

A versatile popover component for displaying rich interactive content triggered by user interaction. Unlike tooltips, popovers can contain complex UI elements like forms, buttons, and links.

**Key Features:**
- 🎯 12 placement options (top, bottom, left, right + start/end variants)
- 🎛️ Controlled and uncontrolled modes
- 🖱️ Click outside to close
- ⌨️ Escape key support
- 🔒 Focus trap for keyboard navigation
- 📦 Rich content support (forms, buttons, lists, etc.)
- ♿ Full accessibility with ARIA attributes
- 🌙 Dark mode support
- 🎨 Customizable styling and offset
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
    isDarkMode: {
      control: 'boolean',
    },
    closeOnClickOutside: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    offset: {
      control: 'number',
    },
    content: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a popover with some helpful information',
    children: <Button>Open Popover</Button>,
  },
};

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '80px',
        padding: '120px 80px',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      <div></div>
      <Popover content="Top Start" placement="top-start">
        <Button size="sm">Top Start</Button>
      </Popover>
      <Popover content="Top" placement="top">
        <Button size="sm">Top</Button>
      </Popover>
      <Popover content="Top End" placement="top-end">
        <Button size="sm">Top End</Button>
      </Popover>
      <div></div>

      <Popover content="Left Start" placement="left-start">
        <Button size="sm">Left Start</Button>
      </Popover>
      <div></div>
      <div></div>
      <div></div>
      <Popover content="Right Start" placement="right-start">
        <Button size="sm">Right Start</Button>
      </Popover>

      <Popover content="Left" placement="left">
        <Button size="sm">Left</Button>
      </Popover>
      <div></div>
      <div></div>
      <div></div>
      <Popover content="Right" placement="right">
        <Button size="sm">Right</Button>
      </Popover>

      <Popover content="Left End" placement="left-end">
        <Button size="sm">Left End</Button>
      </Popover>
      <div></div>
      <div></div>
      <div></div>
      <Popover content="Right End" placement="right-end">
        <Button size="sm">Right End</Button>
      </Popover>

      <div></div>
      <Popover content="Bottom Start" placement="bottom-start">
        <Button size="sm">Bottom Start</Button>
      </Popover>
      <Popover content="Bottom" placement="bottom">
        <Button size="sm">Bottom</Button>
      </Popover>
      <Popover content="Bottom End" placement="bottom-end">
        <Button size="sm">Bottom End</Button>
      </Popover>
      <div></div>
    </div>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <Popover
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>John Doe</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              john.doe@example.com
            </div>
          </div>
          <button
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            Profile
          </button>
          <button
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            Settings
          </button>
          <button
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          >
            Billing
          </button>
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '4px', paddingTop: '4px' }}>
            <button
              style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '4px',
                fontSize: '0.875rem',
                color: '#ef4444',
                width: '100%',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      }
      placement="bottom-end"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#ffffff',
          }}
        >
          JD
        </div>
        <span style={{ fontSize: '0.875rem' }}>John Doe</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{ marginLeft: '4px' }}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </Popover>
  ),
};

export const ColorPicker: Story = {
  render: () => {
    const colors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
    ];

    return (
      <Popover
        content={
          <div>
            <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.875rem' }}>
              Choose a color
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
              }}
            >
              {colors.map((color) => (
                <button
                  key={color}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    backgroundColor: color,
                    border: '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        }
        placement="bottom"
      >
        <Button variant="outline">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '2px',
                backgroundColor: '#3b82f6',
                border: '1px solid #cbd5e1',
              }}
            />
            <span>Color</span>
          </div>
        </Button>
      </Popover>
    );
  },
};

export const WithForm: Story = {
  render: () => (
    <Popover
      content={
        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 500,
                marginBottom: '4px',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Submit</Button>
          </div>
        </form>
      }
      placement="bottom"
    >
      <Button>Add Contact</Button>
    </Popover>
  ),
};

export const ControlledPopover: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Popover
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          content={
            <div>
              <p style={{ margin: 0, marginBottom: '12px' }}>This is a controlled popover.</p>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Close Me
              </Button>
            </div>
          }
          placement="bottom"
        >
          <Button>Toggle Popover</Button>
        </Popover>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Popover is: {isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
    );
  },
};

export const NotificationCenter: Story = {
  render: () => {
    const notifications = [
      { id: 1, title: 'New message', message: 'You have a new message from Alice', time: '5m ago' },
      { id: 2, title: 'Update available', message: 'Version 2.0 is now available', time: '1h ago' },
      { id: 3, title: 'Task completed', message: 'Your export is ready', time: '2h ago' },
    ];

    return (
      <Popover
        content={
          <div style={{ minWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Notifications</h4>
              <button
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#3b82f6',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Mark all as read
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.75rem' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.625rem', color: '#64748b' }}>{notif.time}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                    {notif.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        placement="bottom-end"
      >
        <button
          style={{
            position: 'relative',
            padding: '8px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70802 18.3304 9.42113 18.2537 9.16814 18.1079C8.91515 17.9622 8.70484 17.7526 8.55833 17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: '2px solid #ffffff',
            }}
          />
        </button>
      </Popover>
    );
  },
};

export const ShareDialog: Story = {
  render: () => (
    <Popover
      content={
        <div style={{ minWidth: '240px' }}>
          <h4 style={{ margin: 0, marginBottom: '12px', fontSize: '0.875rem', fontWeight: 600 }}>
            Share this document
          </h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              defaultValue="https://example.com/doc/123"
              readOnly
              style={{
                flex: 1,
                padding: '6px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backgroundColor: '#f8fafc',
              }}
            />
            <Button size="sm">Copy</Button>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
              <button
                key={platform}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      }
      placement="top"
    >
      <Button variant="outline">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M5.33333 8.66667L2 8.66667L2 14L5.33333 14L5.33333 8.66667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 5.99999L10.6667 2.66666L10.6667 5.33332C7.33333 5.33332 5.33333 6.66666 5.33333 8.66666C5.33333 9.99999 6 11.3333 7.33333 12C6.66667 11.3333 6.66667 9.99999 6.66667 9.33332C6.66667 7.33332 8 5.99999 10.6667 5.99999L10.6667 8.66666L14 5.99999Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Share
        </div>
      </Button>
    </Popover>
  ),
};

export const CustomOffset: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Popover content="Default offset (8px)" placement="top">
        <Button size="sm">Default</Button>
      </Popover>
      <Popover content="No offset" placement="top" offset={0}>
        <Button size="sm">No offset</Button>
      </Popover>
      <Popover content="Large offset (24px)" placement="top" offset={24}>
        <Button size="sm">Large offset</Button>
      </Popover>
    </div>
  ),
};

export const NoClickOutside: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        content={
          <div>
            <p style={{ margin: 0, marginBottom: '12px' }}>
              This popover won't close when clicking outside. Use the button below or press Escape.
            </p>
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        }
        closeOnClickOutside={false}
        placement="bottom"
      >
        <Button>Open (No Click Outside)</Button>
      </Popover>
    );
  },
};

export const DarkMode: Story = {
  args: {
    content: 'This is a dark mode popover with rich content support',
    children: <Button>Open Popover</Button>,
  },
  parameters: {
    theme: 'dark',
  },
};
