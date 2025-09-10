import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { Button } from '../../atoms/Button/Button';
import { useState } from 'react';

const meta: Meta<typeof Toast> = {
  title: 'Organisms/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Toast } from '@mond-design-system/theme';

function MyComponent() {
  const [toasts, setToasts] = useState([]);

  const handleDismiss = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  const showToast = () => {
    const newToast = {
      id: Date.now().toString(),
      type: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
    };
    setToasts(prev => [...prev, newToast]);
  };

  return (
    <div>
      <Button onClick={showToast}>Show Toast</Button>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}
\`\`\`

A highly customizable toast notification component with support for different types, auto-dismissal, actions, animations, and accessibility features. Individual toast components are typically managed by a ToastContainer.

**Key Features:**
- 🎨 Four semantic variants (success, error, warning, info)
- ⏱️ Auto-dismissal with configurable duration
- 🎬 Smooth enter/exit animations with pause on hover
- 🎯 Action buttons with customizable variants
- ❌ Dismissible with close button or Escape key
- 🖼️ Custom icons and progress indicators
- ♿ Full accessibility with ARIA attributes and keyboard support
- 🌙 Dark mode support
- 🎛️ Flexible animation states for container management
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the toast',
    },
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Toast variant affecting colors and default icon',
    },
    title: {
      control: 'text',
      description: 'Toast title (required)',
    },
    message: {
      control: 'text',
      description: 'Toast message content',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismissal duration in milliseconds (0 for no auto-dismiss)',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the toast can be manually dismissed',
    },
    actions: {
      control: 'object',
      description: 'Action buttons to display',
    },
    animationState: {
      control: 'select',
      options: ['entering', 'visible', 'exiting'],
      description: 'Animation state for enter/exit transitions',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors',
    },
    onDismiss: {
      description: 'Callback when toast is dismissed',
      action: 'dismissed',
    },
    onPause: {
      description: 'Callback when toast timer is paused',
      action: 'paused',
    },
    onResume: {
      description: 'Callback when toast timer is resumed',
      action: 'resumed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'toast-1',
    title: 'Default Toast',
    onDismiss: () => {},
  },
};

export const Success: Story = {
  args: {
    id: 'toast-success',
    type: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.',
    onDismiss: () => {},
  },
};

export const Error: Story = {
  args: {
    id: 'toast-error',
    type: 'error',
    title: 'Error occurred',
    message: 'Something went wrong. Please try again.',
    onDismiss: () => {},
  },
};

export const Warning: Story = {
  args: {
    id: 'toast-warning',
    type: 'warning',
    title: 'Warning',
    message: 'Please review your input before proceeding.',
    onDismiss: () => {},
  },
};

export const Info: Story = {
  args: {
    id: 'toast-info',
    type: 'info',
    title: 'Information',
    message: 'Here is some helpful information for you.',
    onDismiss: () => {},
  },
};

export const WithActions: Story = {
  args: {
    id: 'toast-actions',
    type: 'info',
    title: 'Confirm Action',
    message: 'Are you sure you want to delete this item?',
    duration: 0, // Don't auto-dismiss
    actions: [
      {
        label: 'Cancel',
        onClick: () => console.log('Cancelled'),
        variant: 'outline',
      },
      {
        label: 'Delete',
        onClick: () => console.log('Deleted'),
        variant: 'primary',
      },
    ],
    onDismiss: () => {},
  },
};

export const CustomIcon: Story = {
  args: {
    id: 'toast-custom',
    type: 'success',
    title: 'Custom Icon',
    message: 'This toast uses a custom icon instead of the default.',
    icon: '🎉',
    onDismiss: () => {},
  },
};

export const NonDismissible: Story = {
  args: {
    id: 'toast-permanent',
    type: 'error',
    title: 'Critical Error',
    message: 'This toast cannot be dismissed by the user.',
    dismissible: false,
    duration: 0,
    onDismiss: () => {},
  },
};

export const NoAutoDismiss: Story = {
  args: {
    id: 'toast-permanent-auto',
    type: 'info',
    title: 'Persistent Toast',
    message: 'This toast will not auto-dismiss but can be closed manually.',
    duration: 0,
    onDismiss: () => {},
  },
};

export const FastDismiss: Story = {
  args: {
    id: 'toast-fast',
    type: 'success',
    title: 'Quick Toast',
    message: 'This toast will dismiss quickly.',
    duration: 2000,
    onDismiss: () => {},
  },
};

export const LongContent: Story = {
  args: {
    id: 'toast-long',
    type: 'warning',
    title: 'Toast with Long Content',
    message: 'This is a toast with a much longer message to demonstrate how the component handles longer content. It should wrap appropriately and maintain good readability.',
    onDismiss: () => {},
  },
};

export const AnimationStates: Story = {
  render: () => {
    const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>('visible');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <Button 
            onClick={() => setAnimationState('entering')}
            variant={animationState === 'entering' ? 'primary' : 'outline'}
            size="sm"
          >
            Entering
          </Button>
          <Button 
            onClick={() => setAnimationState('visible')}
            variant={animationState === 'visible' ? 'primary' : 'outline'}
            size="sm"
          >
            Visible
          </Button>
          <Button 
            onClick={() => setAnimationState('exiting')}
            variant={animationState === 'exiting' ? 'primary' : 'outline'}
            size="sm"
          >
            Exiting
          </Button>
        </div>
        
        <Toast
          id="animation-demo"
          type="info"
          title="Animation Demo"
          message="Watch the animation change as you click the buttons above."
          animationState={animationState}
          onDismiss={() => {}}
          duration={0}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the different animation states: entering (slide in), visible (normal), and exiting (slide out).',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      title: string;
      message: string;
      animationState: 'entering' | 'visible' | 'exiting';
    }>>([]);
    
    const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
      const messages = {
        success: { title: 'Success!', message: 'Operation completed successfully.' },
        error: { title: 'Error', message: 'Something went wrong.' },
        warning: { title: 'Warning', message: 'Please proceed with caution.' },
        info: { title: 'Info', message: 'Here is some information.' },
      };
      
      const newToast = {
        id: Date.now().toString(),
        type,
        ...messages[type],
        animationState: 'entering' as const,
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Animate to visible
      setTimeout(() => {
        setToasts(prev => prev.map(toast => 
          toast.id === newToast.id ? { ...toast, animationState: 'visible' } : toast
        ));
      }, 50);
    };
    
    const handleDismiss = (toastId: string) => {
      // Animate out
      setToasts(prev => prev.map(toast => 
        toast.id === toastId ? { ...toast, animationState: 'exiting' } : toast
      ));
      
      // Remove after animation
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== toastId));
      }, 300);
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Button 
            onClick={() => addToast('success')}
            variant="primary"
            size="sm"
          >
            Add Success
          </Button>
          <Button 
            onClick={() => addToast('error')}
            variant="primary"
            size="sm"
          >
            Add Error
          </Button>
          <Button 
            onClick={() => addToast('warning')}
            variant="primary"
            size="sm"
          >
            Add Warning
          </Button>
          <Button 
            onClick={() => addToast('info')}
            variant="primary"
            size="sm"
          >
            Add Info
          </Button>
          <Button 
            onClick={() => setToasts([])}
            variant="outline"
            size="sm"
          >
            Clear All
          </Button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              animationState={toast.animationState}
              onDismiss={handleDismiss}
              duration={5000}
            />
          ))}
        </div>
        
        {toasts.length === 0 && (
          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '32px' }}>
            Click the buttons above to add toasts and see them in action!
          </p>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing how toasts work with proper animation states and dismissal handling.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    id: 'toast-dark',
    type: 'info',
    title: 'Dark Mode Toast',
    message: 'This toast is displayed in dark mode with appropriate theming.',
    isDarkMode: true,
    onDismiss: () => {},
  },
  parameters: {
    theme: 'dark',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Toast
        id="all-success"
        type="success"
        title="Success Toast"
        message="Operation completed successfully."
        onDismiss={() => {}}
        duration={0}
      />
      <Toast
        id="all-error"
        type="error"
        title="Error Toast"
        message="An error occurred during the operation."
        onDismiss={() => {}}
        duration={0}
      />
      <Toast
        id="all-warning"
        type="warning"
        title="Warning Toast"
        message="Please review before proceeding."
        onDismiss={() => {}}
        duration={0}
      />
      <Toast
        id="all-info"
        type="info"
        title="Info Toast"
        message="Here is some helpful information."
        onDismiss={() => {}}
        duration={0}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All toast variants displayed together for comparison.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    id: 'playground-toast',
    type: 'info',
    title: 'Playground Toast',
    message: 'Experiment with different toast configurations using the controls below.',
    duration: 5000,
    dismissible: true,
    animationState: 'visible',
    isDarkMode: false,
    onDismiss: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different toast configurations.',
      },
    },
  },
};