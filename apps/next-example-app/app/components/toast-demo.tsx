'use client';

import { useState } from 'react';
import { Button, Text, Heading } from '@mond-design-system/theme';
import { ToastContainer, ToastData } from '@mond-design-system/theme/client';

/**
 * ToastDemo Component (Client Component)
 *
 * Demonstrates toast notifications with interactive buttons.
 * This is a Client Component because it uses state and event handlers.
 */
export function ToastDemo() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: {
        title: 'Success!',
        message: 'Your action was completed successfully.',
      },
      error: {
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      },
      warning: {
        title: 'Warning',
        message: 'Please proceed with caution.',
      },
      info: {
        title: 'Information',
        message: 'Here is some helpful information.',
      },
    };

    const newToast: ToastData = {
      id: Date.now().toString(),
      type,
      ...messages[type],
      duration: 5000,
      dismissible: true,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismiss = (toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  return (
    <>
      <section
        style={{
          backgroundColor: 'var(--mond-surface-elevated)',
          borderRadius: '8px',
          padding: '2rem',
          border: '1px solid var(--mond-border-default)',
        }}
      >
        <Heading level={2} size="2xl">
          Toast Notifications Demo
        </Heading>
        <div style={{ marginTop: '0.5rem' }}>
          <Text variant="body" semantic="secondary">
            Click the buttons below to trigger different types of toast notifications
          </Text>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <Button variant="primary" size="lg" onClick={() => showToast('success')}>
            Show Success Toast
          </Button>
          <Button variant="destructive" size="lg" onClick={() => showToast('error')}>
            Show Error Toast
          </Button>
          <Button variant="warning" size="lg" onClick={() => showToast('warning')}>
            Show Warning Toast
          </Button>
          <Button variant="outline" size="lg" onClick={() => showToast('info')}>
            Show Info Toast
          </Button>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismiss}
        position="top-right"
        maxToasts={5}
      />
    </>
  );
}
