import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import { useState } from 'react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Switch } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [enabled, setEnabled] = useState(false);
  
  return (
    <Switch
      label="Enable notifications"
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
    />
  );
}
\`\`\`

A smooth toggle switch component for binary choices and settings. Perfect for enabling/disabling features, preferences, and boolean states.

**Key Features:**
- 🔄 Smooth toggle animation with visual feedback
- 📏 Three sizes (sm, md, lg) for different contexts
- 📝 Built-in label and helper text support
- ⚠️ Error state handling for validation
- ♿ Full keyboard navigation and ARIA support
- 🎨 Accessible color contrast in all states
- 🌙 Dark mode support
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch 
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Switch 
        label="Enable notifications"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        helperText="Receive email notifications about updates"
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [small, setSmall] = useState(false);
    const [medium, setMedium] = useState(true);
    const [large, setLarge] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Switch 
          size="sm" 
          label="Small switch" 
          checked={small}
          onChange={(e) => setSmall(e.target.checked)}
        />
        <Switch 
          size="md" 
          label="Medium switch" 
          checked={medium}
          onChange={(e) => setMedium(e.target.checked)}
        />
        <Switch 
          size="lg" 
          label="Large switch" 
          checked={large}
          onChange={(e) => setLarge(e.target.checked)}
        />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch label="Off state" checked={false} />
      <Switch label="On state" checked={true} />
      <Switch label="Disabled off" disabled checked={false} />
      <Switch label="Disabled on" disabled checked={true} />
    </div>
  ),
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch 
        label="Accept terms"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        error="You must accept the terms to continue"
      />
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        label="Dark mode setting"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        helperText="Toggle dark mode theme"
      />
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const ControlledGroup: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Preferences:</div>
        <Switch 
          label="Email notifications"
          checked={notifications}
          onChange={(e) => setNotifications(e.target.checked)}
          helperText="Get notified about important updates"
        />
        <Switch 
          label="Marketing emails"
          checked={marketing}
          onChange={(e) => setMarketing(e.target.checked)}
          helperText="Receive promotional content"
        />
        <Switch 
          label="Analytics tracking"
          checked={analytics}
          onChange={(e) => setAnalytics(e.target.checked)}
          helperText="Help us improve the product"
        />
        
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Settings:</strong><br />
          Notifications: {notifications ? 'On' : 'Off'}<br />
          Marketing: {marketing ? 'On' : 'Off'}<br />
          Analytics: {analytics ? 'On' : 'Off'}
        </div>
      </div>
    );
  },
};