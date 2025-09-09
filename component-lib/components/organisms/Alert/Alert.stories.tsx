import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Organisms/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Alert } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Alert variant="success" dismissible>
      Your changes have been saved successfully!
    </Alert>
  );
}
\`\`\`

A versatile alert component for displaying important messages, notifications, and system feedback. Essential for user communication and status updates.

**Key Features:**
- 🚨 Four variants (info, success, warning, error) for different message types
- ❌ Optional dismissible functionality with close button
- 🎨 Semantic colors and icons for instant recognition
- 📝 Rich content support (text, links, buttons)
- ♿ Full accessibility with ARIA live regions
- 🌙 Dark mode support with proper contrast
- 🎯 Auto-focus management for screen readers
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    dismissible: {
      control: 'boolean',
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      This is a default info alert message with some helpful information.
    </Alert>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="info">
        This is an info alert. It provides neutral information to the user.
      </Alert>
      
      <Alert variant="success">
        Success! Your action was completed successfully.
      </Alert>
      
      <Alert variant="warning">
        Warning: Please review your settings before proceeding.
      </Alert>
      
      <Alert variant="error">
        Error: Something went wrong. Please try again.
      </Alert>
    </div>
  ),
};

export const WithTitles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="info" title="Information">
        Here's some additional context about the current situation that you should be aware of.
      </Alert>
      
      <Alert variant="success" title="Operation Successful">
        Your changes have been saved and will take effect immediately.
      </Alert>
      
      <Alert variant="warning" title="Action Required">
        Your subscription will expire in 3 days. Please renew to continue using the service.
      </Alert>
      
      <Alert variant="error" title="Authentication Failed">
        Invalid credentials provided. Please check your username and password.
      </Alert>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert
        variant="info"
        title="Update Available"
        actions={[
          { label: 'Update Now', onClick: () => console.log('Update clicked'), variant: 'primary' },
          { label: 'Later', onClick: () => console.log('Later clicked'), variant: 'outline' },
        ]}
      >
        A new version of the application is available with bug fixes and improvements.
      </Alert>
      
      <Alert
        variant="warning"
        title="Unsaved Changes"
        actions={[
          { label: 'Save', onClick: () => console.log('Save clicked'), variant: 'primary' },
          { label: 'Discard', onClick: () => console.log('Discard clicked'), variant: 'outline' },
          { label: 'Continue Editing', onClick: () => console.log('Continue clicked'), variant: 'ghost' },
        ]}
      >
        You have unsaved changes that will be lost if you navigate away from this page.
      </Alert>
      
      <Alert
        variant="error"
        title="Payment Failed"
        actions={[
          { label: 'Retry Payment', onClick: () => console.log('Retry clicked'), variant: 'primary' },
          { label: 'Update Card', onClick: () => console.log('Update clicked'), variant: 'outline' },
        ]}
      >
        We couldn't process your payment. Please check your payment method and try again.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'info' as const, title: 'System Notification', message: 'Your profile has been updated successfully.' },
      { id: 2, variant: 'warning' as const, title: 'Storage Warning', message: 'You are running low on storage space.' },
      { id: 3, variant: 'success' as const, title: 'Backup Complete', message: 'Your data has been backed up safely.' },
    ]);

    const dismissAlert = (id: number) => {
      setAlerts(alerts.filter(alert => alert.id !== id));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            dismissible
            onDismiss={() => dismissAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        ))}
        {alerts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            All alerts dismissed! Refresh to see them again.
          </p>
        )}
      </div>
    );
  },
};

export const ComplexContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert variant="info" title="Welcome to the Platform">
        <p>Thank you for joining our service. Here's what you can do next:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Complete your profile setup</li>
          <li>Explore the dashboard features</li>
          <li>Connect with your team members</li>
        </ul>
        <p>Need help? Check out our <a href="#docs" style={{ color: 'inherit', textDecoration: 'underline' }}>documentation</a>.</p>
      </Alert>

      <Alert variant="error" title="Multiple Validation Errors">
        <p>Please fix the following issues before continuing:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><strong>Email:</strong> Must be a valid email address</li>
          <li><strong>Password:</strong> Must contain at least 8 characters</li>
          <li><strong>Phone:</strong> Required field cannot be empty</li>
        </ul>
      </Alert>
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
      gap: '1rem'
    }}>
      <Alert variant="info" isDarkMode title="Dark Mode Info">
        This is how alerts look in dark mode with info styling.
      </Alert>
      
      <Alert variant="success" isDarkMode title="Success in Dark Mode">
        Your action completed successfully in dark theme.
      </Alert>
      
      <Alert variant="warning" isDarkMode title="Dark Mode Warning">
        This is a warning alert displayed in dark mode.
      </Alert>
      
      <Alert 
        variant="error" 
        isDarkMode 
        title="Error in Dark Mode"
        dismissible
        onDismiss={() => console.log('Dark mode alert dismissed')}
      >
        This is an error alert in dark mode with dismiss functionality.
      </Alert>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert
        variant="success"
        title="Order Confirmed"
        actions={[
          { label: 'View Order', onClick: () => console.log('View order'), variant: 'primary' },
          { label: 'Continue Shopping', onClick: () => console.log('Continue shopping'), variant: 'outline' },
        ]}
      >
        Your order #12345 has been confirmed and will be shipped within 2-3 business days.
      </Alert>

      <Alert
        variant="warning"
        title="Security Alert"
        dismissible
        onDismiss={() => console.log('Security alert dismissed')}
        actions={[
          { label: 'Secure Account', onClick: () => console.log('Secure account'), variant: 'primary' },
          { label: 'Learn More', onClick: () => console.log('Learn more'), variant: 'outline' },
        ]}
      >
        We detected a login from a new device. If this wasn't you, please secure your account immediately.
      </Alert>

      <Alert variant="info" title="Maintenance Scheduled">
        <p>We'll be performing system maintenance on <strong>Sunday, March 15th from 2:00 AM - 4:00 AM EST</strong>.</p>
        <p>During this time, some features may be temporarily unavailable. We appreciate your patience.</p>
      </Alert>

      <Alert
        variant="error"
        title="Connection Error"
        actions={[
          { label: 'Retry', onClick: () => console.log('Retry connection'), variant: 'primary' },
          { label: 'Work Offline', onClick: () => console.log('Work offline'), variant: 'outline' },
        ]}
      >
        Unable to connect to server. Please check your internet connection and try again.
      </Alert>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'info',
    title: 'Alert Title',
    dismissible: false,
    isDarkMode: false,
    children: 'This is the alert message content.',
  },
  render: (args) => <Alert {...args} />,
};