'use client';

import { useState, useEffect } from 'react';
import { Button, Text, Heading } from '@mond-design-system/theme';
import { ToastContainer, ToastData } from '@mond-design-system/theme/client';
import { Header } from '../components/header';
import Link from 'next/link';

/**
 * Client Page (CSR)
 *
 * Demonstrates Client-Side Rendering with MDS components.
 * Features interactive buttons and dynamic content loading.
 * Uses only Button, Text, Heading, and Toast components as required.
 */
export default function ClientPage() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [counter, setCounter] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', customMessage?: string) => {
    const messages = {
      success: {
        title: 'Success!',
        message: customMessage || 'Client-side action completed successfully.',
      },
      error: {
        title: 'Error',
        message: customMessage || 'Client-side error occurred.',
      },
      warning: {
        title: 'Warning',
        message: customMessage || 'Client-side warning triggered.',
      },
      info: {
        title: 'Information',
        message: customMessage || 'Client-side information message.',
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

  const incrementCounter = () => {
    setCounter((prev) => prev + 1);
    showToast('success', `Counter incremented to ${counter + 1}`);
  };

  const resetCounter = () => {
    setCounter(0);
    showToast('info', 'Counter reset to 0');
  };

  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 2rem',
        }}
      >
        {/* Hero Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Heading level={1} size="4xl">
            Client-Side Rendering Demo
          </Heading>
          <div style={{ marginTop: '1rem' }}>
            <Text size="2xl" semantic="secondary">
              Interactive Client Components
            </Text>
          </div>
          <div style={{ marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <Text size="md">
              This page demonstrates client-side rendering with interactive components.
              All state is managed on the client, showcasing the flexibility of the MDS
              component library in CSR environments.
            </Text>
          </div>
        </section>

        {/* Navigation */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">
              ← Back to Home (SSR)
            </Button>
          </Link>
        </div>

        {/* Counter Section */}
        <section
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            borderRadius: '8px',
            padding: '2rem',
            border: '1px solid var(--mond-border-default)',
            marginBottom: '2rem',
          }}
        >
          <Heading level={2} size="2xl">
            Interactive Counter
          </Heading>
          <div style={{ marginTop: '0.5rem' }}>
            <Text size="md" semantic="secondary">
              Client-side state management demonstration
            </Text>
          </div>

          <div
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              padding: '2rem',
              backgroundColor: 'var(--mond-surface-base)',
              borderRadius: '8px',
            }}
          >
            <Heading level={3} size="4xl">
              {counter}
            </Heading>
            <div style={{ marginTop: '0.5rem' }}>
              <Text size="md" semantic="secondary">
                Current Count
              </Text>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '2rem',
              }}
            >
              <Button variant="primary" size="lg" onClick={incrementCounter}>
                Increment
              </Button>
              <Button variant="outline" size="lg" onClick={resetCounter}>
                Reset
              </Button>
            </div>
          </div>
        </section>

        {/* Toast Triggers Section */}
        <section
          style={{
            backgroundColor: 'var(--mond-surface-elevated)',
            borderRadius: '8px',
            padding: '2rem',
            border: '1px solid var(--mond-border-default)',
          }}
        >
          <Heading level={2} size="2xl">
            Client-Side Toast Notifications
          </Heading>
          <div style={{ marginTop: '0.5rem' }}>
            <Text size="md" semantic="secondary">
              Trigger toast notifications from client-side interactions
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
              Show Success
            </Button>
            <Button variant="destructive" size="lg" onClick={() => showToast('error')}>
              Show Error
            </Button>
            <Button variant="warning" size="lg" onClick={() => showToast('warning')}>
              Show Warning
            </Button>
            <Button variant="outline" size="lg" onClick={() => showToast('info')}>
              Show Info
            </Button>
          </div>
        </section>

        {/* Client Info Section */}
        <section style={{ marginTop: '4rem' }}>
          <Heading level={2} size="2xl">
            Client-Side Features
          </Heading>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            <InfoCard
              title="Mounted State"
              value={mounted ? 'Yes' : 'No'}
              description="Component is mounted on the client"
            />
            <InfoCard
              title="Counter Value"
              value={counter.toString()}
              description="Current counter state value"
            />
            <InfoCard
              title="Active Toasts"
              value={toasts.length.toString()}
              description="Number of active toast notifications"
            />
            <InfoCard
              title="Rendering Mode"
              value="CSR"
              description="Client-Side Rendering"
            />
          </div>
        </section>

        {/* CSR vs SSR Comparison */}
        <section style={{ marginTop: '4rem' }}>
          <Heading level={2} size="2xl">
            CSR vs SSR Comparison
          </Heading>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            <ComparisonCard
              title="Server-Side Rendering (SSR)"
              features={[
                'Initial HTML rendered on server',
                'Better SEO and performance',
                'Faster initial page load',
                'Content available without JavaScript',
              ]}
              link="/"
            />
            <ComparisonCard
              title="Client-Side Rendering (CSR)"
              features={[
                'Dynamic content loading',
                'Rich interactive experiences',
                'State management on client',
                'Ideal for authenticated apps',
              ]}
              link="/client"
            />
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--mond-border-default)',
            textAlign: 'center',
          }}
        >
          <Text size="sm" semantic="secondary">
            Client-Side Rendered Page • Built with Mond Design System
          </Text>
        </footer>
      </main>

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

/**
 * InfoCard Component
 */
function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--mond-surface-elevated)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--mond-border-default)',
      }}
    >
      <Text size="sm" semantic="secondary">
        {title}
      </Text>
      <div style={{ marginTop: '0.5rem' }}>
        <Heading level={3} size="2xl">
          {value}
        </Heading>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Text size="xs" semantic="secondary">
          {description}
        </Text>
      </div>
    </div>
  );
}

/**
 * ComparisonCard Component
 */
function ComparisonCard({
  title,
  features,
  link,
}: {
  title: string;
  features: string[];
  link: string;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--mond-surface-elevated)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--mond-border-default)',
      }}
    >
      <Heading level={3} size="md">
        {title}
      </Heading>
      <ul
        style={{
          marginTop: '1rem',
          paddingLeft: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {features.map((feature, index) => (
          <li key={index}>
            <Text size="sm">{feature}</Text>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <Link href={link} style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm">
            View Example
          </Button>
        </Link>
      </div>
    </div>
  );
}
