import { Button, Text, Heading } from '@mond-design-system/theme';
import { Header } from './components/header';
import { ToastDemo } from './components/toast-demo';
import Link from 'next/link';

/**
 * Home Page (Server Component - SSR)
 *
 * This is a TRUE Server Component that demonstrates:
 * - MDS components (Button, Text, Heading) work perfectly in SSR
 * - Server-rendered content with optimal performance
 * - Client Components (ToastDemo) can be nested for interactivity
 *
 * Note: No 'use client' directive - this page is server-rendered by default
 */
export default function HomePage() {
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
        {/* Hero Section - Server Rendered */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <Heading level={1} size="4xl">
            Mond Design System
          </Heading>
          <div style={{ marginTop: '1rem' }}>
            <Text variant="headline" semantic="secondary">
              CSS Variables API Proof of Concept
            </Text>
          </div>
          <div style={{ marginTop: '1.5rem', maxWidth: '600px', margin: '1.5rem auto 0' }}>
            <Text variant="body">
              This is a demonstration of the Mond Design System using the new CSS variables API
              with a custom violet brand theme. This page is server-rendered (SSR), proving MDS
              components work seamlessly with Next.js Server Components.
            </Text>
          </div>
        </section>

        {/* Navigation - Server Rendered */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Link href="/client" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              View Client-Side Rendering Demo →
            </Button>
          </Link>
        </div>

        {/* Toast Demo - Client Component for Interactivity */}
        <ToastDemo />

        {/* Features Section - Server Rendered */}
        <section style={{ marginTop: '4rem' }}>
          <Heading level={2} size="2xl">
            Key Features
          </Heading>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            <FeatureCard
              title="CSS Variables API"
              description="All theming is powered by CSS variables, enabling dynamic theme switching without JavaScript overhead."
            />
            <FeatureCard
              title="Custom Brand Theme"
              description="Demonstrates custom brand theming with violet as the primary color, replacing the default Mond theme."
            />
            <FeatureCard
              title="SSR Compatible"
              description="This page is a true Server Component - MDS components work seamlessly with Next.js SSR for optimal performance and SEO."
            />
            <FeatureCard
              title="Dark Mode Support"
              description="Toggle between light and dark modes using the light switch in the header."
            />
            <FeatureCard
              title="Toast Notifications"
              description="Rich toast notification system with multiple variants and auto-dismiss functionality."
            />
            <FeatureCard
              title="Accessible Components"
              description="All components follow WCAG accessibility guidelines with proper ARIA attributes."
            />
          </div>
        </section>

        {/* Component Examples Section - Server Rendered */}
        <section style={{ marginTop: '4rem' }}>
          <Heading level={2} size="2xl">
            Component Examples
          </Heading>

          {/* Button Variants */}
          <div style={{ marginTop: '2rem' }}>
            <Heading level={3} size="lg">
              Button Variants
            </Heading>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <Button variant="primary" size="md">
                Primary
              </Button>
              <Button variant="outline" size="md">
                Outline
              </Button>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
              <Button variant="destructive" size="md">
                Destructive
              </Button>
              <Button variant="warning" size="md">
                Warning
              </Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div style={{ marginTop: '2rem' }}>
            <Heading level={3} size="lg">
              Button Sizes
            </Heading>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
                marginTop: '1rem',
              }}
            >
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </div>

          {/* Text Variants */}
          <div style={{ marginTop: '2rem' }}>
            <Heading level={3} size="lg">
              Text Variants
            </Heading>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Text variant="display">Display Text</Text>
              <Text variant="headline">Headline Text</Text>
              <Text variant="title">Title Text</Text>
              <Text variant="body">Body Text - Regular paragraph text with default styling</Text>
              <Text variant="body-sm">Body Small Text - Smaller body text variant</Text>
              <Text variant="caption">Caption Text - Small supplementary text</Text>
            </div>
          </div>

          {/* Text Semantic Colors */}
          <div style={{ marginTop: '2rem' }}>
            <Heading level={3} size="lg">
              Text Semantic Colors
            </Heading>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Text variant="body">Primary Text (Default)</Text>
              <Text variant="body" semantic="secondary">
                Secondary Text
              </Text>
              <Text variant="body" semantic="success">
                Success Text
              </Text>
              <Text variant="body" semantic="error">
                Error Text
              </Text>
              <Text variant="body" semantic="warning">
                Warning Text
              </Text>
            </div>
          </div>
        </section>

        {/* Footer - Server Rendered */}
        <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--mond-border-default)', textAlign: 'center' }}>
          <Text variant="body-sm" semantic="secondary">
            Built with Mond Design System • Next.js 16 • React 19
          </Text>
        </footer>
      </main>
    </>
  );
}

/**
 * FeatureCard Component (Server Component)
 *
 * Displays a feature card with title and description.
 * This is server-rendered, demonstrating MDS components work in SSR.
 */
function FeatureCard({ title, description }: { title: string; description: string }) {
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
      <div style={{ marginTop: '0.5rem' }}>
        <Text variant="body-sm" semantic="secondary">
          {description}
        </Text>
      </div>
    </div>
  );
}
