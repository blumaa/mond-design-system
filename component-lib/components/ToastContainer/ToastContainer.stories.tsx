import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import { ToastContainer, ToastData } from './ToastContainer';
import { Toast } from './Toast';
import { Button } from '../Button/Button';
import { Box } from '../Box/Box';

const meta: Meta<typeof ToastContainer> = {
  title: 'Components/ToastContainer',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { ToastContainer, ToastData } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const newToast: ToastData = {
      id: Date.now().toString(),
      type,
      title: 'Notification',
      message: 'This is a toast message',
      duration: 5000,
      dismissible: true,
    };
    setToasts(prev => [...prev, newToast]);
  };
  
  const handleDismiss = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };
  
  return (
    <>
      <button onClick={() => addToast('success')}>Show Success</button>
      <ToastContainer
        toasts={toasts}
        position="top-right"
        maxToasts={5}
        onDismiss={handleDismiss}
      />
    </>
  );
}
\`\`\`

A complete toast notification system that displays multiple toast messages with different types, positioning, and animations.

**Key Features:**
- 🎯 Multiple toast types (success, error, warning, info)
- 📍 Configurable positioning (6 screen positions)
- ⏱️ Auto-dismissal with pause-on-hover
- ❌ Manual dismissal and keyboard navigation
- 📲 Action buttons support
- 📑 Queue management with display limits
- 🎨 Smooth enter/exit animations
- ♿ Full accessibility compliance
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
      description: 'Position of the toast container on screen',
    },
    maxToasts: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of toasts to display simultaneously',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

// Interactive demo component
const ToastDemo = ({
  position = 'top-right',
  maxToasts = 5,
}: {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const handleDismiss = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  const addToast = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toastData: ToastData = {
      id,
      type,
      title: getToastTitle(type),
      message: getToastMessage(type),
      duration: type === 'error' ? 0 : 5000, // Error toasts persist
      dismissible: true,
      actions: type === 'error' ? [
        { label: 'Retry', onClick: () => console.log('Retry clicked') },
        { label: 'Dismiss', onClick: () => handleDismiss(id), variant: 'outline' },
      ] : undefined,
    };
    
    setToasts(prev => [...prev, toastData]);
  }, [handleDismiss]);

  const addPersistentToast = useCallback(() => {
    const id = `persistent-${Date.now()}`;
    const toastData: ToastData = {
      id,
      type: 'warning',
      title: 'Persistent Warning',
      message: 'This toast will not auto-dismiss. You must close it manually.',
      duration: 0,
      dismissible: true,
    };
    
    setToasts(prev => [...prev, toastData]);
  }, []);

  const addCustomToast = useCallback(() => {
    const id = `custom-${Date.now()}`;
    const toastData: ToastData = {
      id,
      type: 'info',
      title: 'Custom Toast',
      message: 'This toast has a custom icon and actions.',
      duration: 8000,
      dismissible: true,
      icon: <span>🎉</span>,
      actions: [
        { label: 'View Details', onClick: () => console.log('View details') },
        { label: 'Later', onClick: () => handleDismiss(id), variant: 'outline' },
      ],
    };
    
    setToasts(prev => [...prev, toastData]);
  }, [handleDismiss]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <Box style={{
      padding: '2rem',
      minHeight: '100vh',
    }}>
      <Box style={{ marginBottom: '2rem' }}>
        <h2>Toast Container Demo</h2>
        <p>Click the buttons below to add different types of toasts. Try hovering over toasts to pause auto-dismissal!</p>
        
        <Box style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap', 
          marginTop: '1rem' 
        }}>
          <Button onClick={() => addToast('success')} variant="primary">
            Add Success Toast
          </Button>
          <Button onClick={() => addToast('error')} variant="primary">
            Add Error Toast (Persistent)
          </Button>
          <Button onClick={() => addToast('warning')} variant="primary">
            Add Warning Toast
          </Button>
          <Button onClick={() => addToast('info')} variant="primary">
            Add Info Toast
          </Button>
          <Button onClick={addPersistentToast} variant="outline">
            Add Persistent Toast
          </Button>
          <Button onClick={addCustomToast} variant="outline">
            Add Custom Toast
          </Button>
          <Button onClick={clearAll} variant="ghost">
            Clear All
          </Button>
        </Box>
        
        <Box style={{ marginTop: '1rem' }}>
          <p><strong>Active Toasts:</strong> {toasts.length} / {maxToasts}</p>
          <p><strong>Position:</strong> {position}</p>
        </Box>
      </Box>

      <ToastContainer
        toasts={toasts}
        position={position}
        maxToasts={maxToasts}
        onDismiss={handleDismiss}
        data-testid="demo-toast-container"
      />
    </Box>
  );
};

function getToastTitle(type: string) {
  switch (type) {
    case 'success': return 'Success!';
    case 'error': return 'Error occurred';
    case 'warning': return 'Warning';
    case 'info': return 'Information';
    default: return 'Notification';
  }
}

function getToastMessage(type: string) {
  switch (type) {
    case 'success': return 'Your operation completed successfully.';
    case 'error': return 'Something went wrong. Please try again.';
    case 'warning': return 'Please review your input before continuing.';
    case 'info': return 'Here\'s some helpful information for you.';
    default: return 'This is a notification message.';
  }
}

// Default interactive story
export const Interactive: Story = {
  render: (args) => <ToastDemo {...args} />,
  args: {
    position: 'top-right',
    maxToasts: 5,
  },
};

// Static examples showing different toast types
export const ToastTypes: Story = {
  render: () => (
    <Box style={{ 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px',
    }}>
      <h3>Toast Types</h3>
      
      <Toast
        id="success-toast"
        type="success"
        title="Success Toast"
        message="Operation completed successfully"
        onDismiss={() => {}}
        animationState="visible"
      />
      
      <Toast
        id="error-toast"
        type="error"
        title="Error Toast"
        message="Something went wrong"
        onDismiss={() => {}}
        animationState="visible"
        actions={[
          { label: 'Retry', onClick: () => {} },
          { label: 'Cancel', onClick: () => {}, variant: 'outline' },
        ]}
      />
      
      <Toast
        id="warning-toast"
        type="warning"
        title="Warning Toast"
        message="Please review your input"
        onDismiss={() => {}}
        animationState="visible"
      />
      
      <Toast
        id="info-toast"
        type="info"
        title="Info Toast"
        message="Here's some helpful information"
        onDismiss={() => {}}
        animationState="visible"
      />
    </Box>
  ),
};

// Positioning examples
export const Positions: Story = {
  render: () => {
    const [activePosition, setActivePosition] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('top-right');
    
    const sampleToasts: ToastData[] = [
      {
        id: '1',
        type: 'success',
        title: 'Positioned Toast',
        message: `This toast is positioned at ${activePosition}`,
        duration: 0,
        dismissible: false,
      },
    ];

    return (
      <Box style={{ 
        padding: '2rem',
        minHeight: '100vh',
        position: 'relative',
      }}>
        <h3>Toast Positions</h3>
        <p>Select a position to see how toasts are displayed:</p>
        
        <Box style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}>
          {(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'] as const).map(position => (
            <Button
              key={position}
              variant={activePosition === position ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActivePosition(position)}
            >
              {position}
            </Button>
          ))}
        </Box>

        <ToastContainer
          toasts={sampleToasts}
          position={activePosition}
          onDismiss={() => {}}
        />
      </Box>
    );
  },
};

// Dark mode example
export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
      <ToastDemo {...args} />
    </div>
  ),
  args: {
    position: 'top-right',
    maxToasts: 5,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Animation states showcase
export const AnimationStates: Story = {
  render: () => {
    const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>('entering');
    
    return (
      <Box style={{ 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        <div>
          <h3>Animation States</h3>
          <p>See how toasts animate during their lifecycle:</p>
          
          <Box style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            {(['entering', 'visible', 'exiting'] as const).map(state => (
              <Button
                key={state}
                variant={animationState === state ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setAnimationState(state)}
              >
                {state}
              </Button>
            ))}
          </Box>
        </div>
        
        <Box style={{ maxWidth: '400px' }}>
          <Toast
            id="animation-toast"
            type="info"
            title="Animated Toast"
            message={`Currently showing ${animationState} state`}
            onDismiss={() => {}}
            animationState={animationState}
          />
        </Box>
      </Box>
    );
  },
};

// Performance test with many toasts
export const PerformanceTest: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    
    const addManyToasts = () => {
      const newToasts: ToastData[] = Array.from({ length: 20 }, (_, i) => ({
        id: `perf-toast-${Date.now()}-${i}`,
        type: (['success', 'error', 'warning', 'info'] as const)[i % 4],
        title: `Toast ${i + 1}`,
        message: `Performance test toast number ${i + 1}`,
        duration: 10000,
        dismissible: true,
      }));
      
      setToasts(prev => [...prev, ...newToasts]);
    };
    
    const clearAll = () => setToasts([]);
    
    return (
      <Box style={{ padding: '2rem', minHeight: '100vh' }}>
        <h3>Performance Test</h3>
        <p>Test how the ToastContainer handles many toasts with queue management:</p>
        
        <Box style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Button onClick={addManyToasts} variant="primary">
            Add 20 Toasts
          </Button>
          <Button onClick={clearAll} variant="outline">
            Clear All
          </Button>
        </Box>
        
        <p><strong>Active Toasts:</strong> {toasts.length}</p>
        <p><strong>Max Display:</strong> 5 (others queued)</p>
        
        <ToastContainer
          toasts={toasts}
          position="top-right"
          maxToasts={5}
          onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
        />
      </Box>
    );
  },
};