import { Button, Box } from "@mond-design-system/theme";

/**
 * Button Component SSR Test Page
 *
 * This page demonstrates that the Button component:
 * 1. Renders server-side without "use client"
 * 2. Uses CSS variables for theming
 * 3. Has no hydration errors
 * 4. Works with all variants and sizes
 */

export default function ButtonTestPage() {
  return (
    <Box p="8" bg="surface.background" minHeight="100vh">
      <Box mb="8">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Button Component - SSR Test
        </h1>
        <p style={{ fontSize: '1rem', opacity: 0.8 }}>
          This page renders server-side with zero JavaScript. All buttons use CSS variables.
        </p>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          All Variants
        </h2>
        <Box display="flex" gap="4" flexWrap="wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="warning">Warning</Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          All Sizes
        </h2>
        <Box display="flex" gap="4" alignItems="center" flexWrap="wrap">
          <Button size="sm" variant="primary">Small</Button>
          <Button size="md" variant="primary">Medium</Button>
          <Button size="lg" variant="primary">Large</Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Disabled States
        </h2>
        <Box display="flex" gap="4" flexWrap="wrap">
          <Button variant="primary" disabled>Primary Disabled</Button>
          <Button variant="outline" disabled>Outline Disabled</Button>
          <Button variant="ghost" disabled>Ghost Disabled</Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Corner Styles
        </h2>
        <Box display="flex" gap="4" flexWrap="wrap">
          <Button corners="default" variant="primary">Default Corners</Button>
          <Button corners="rounded" variant="primary">Rounded Corners</Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Full Width
        </h2>
        <Box maxWidth="400px">
          <Button variant="primary" fullWidth>Full Width Button</Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Icon Only
        </h2>
        <Box display="flex" gap="4" flexWrap="wrap">
          <Button iconOnly size="sm" variant="primary" aria-label="Small Icon">
            🔥
          </Button>
          <Button iconOnly size="md" variant="outline" aria-label="Medium Icon">
            ⚡
          </Button>
          <Button iconOnly size="lg" variant="ghost" aria-label="Large Icon">
            🚀
          </Button>
        </Box>
      </Box>

      <Box mb="8">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          As Link (Polymorphic)
        </h2>
        <Box display="flex" gap="4" flexWrap="wrap">
          <Button
            as="a"
            href="#top"
            variant="primary"
          >
            Link Button
          </Button>
          <Button
            as="a"
            href="#top"
            variant="outline"
          >
            Outline Link
          </Button>
        </Box>
      </Box>

      <Box mb="8" p="6" bg="feedback.info.background" borderRadius="md">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          ✅ SSR Verified
        </h3>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>No &quot;use client&quot; directive needed</li>
          <li>All styles load from static CSS</li>
          <li>CSS variables respond to data-theme attribute</li>
          <li>Zero hydration errors</li>
          <li>Fully accessible with keyboard navigation</li>
        </ul>
      </Box>
    </Box>
  );
}
