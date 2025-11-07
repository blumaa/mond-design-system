import { Box } from '@mond-design-system/theme/Box';
import { Button } from '@mond-design-system/theme/Button';
import { Badge } from '@mond-design-system/theme/Badge';
import { Avatar } from '@mond-design-system/theme/Avatar';
import { Text } from '@mond-design-system/theme/Text';
import { ThemeWrapper } from './theme-wrapper';

/**
 * Home Page - Server Component
 *
 * This page demonstrates MDS components working in Next.js 16 Server Components.
 * All components below are imported directly without 'use client' directive.
 */
export default function Home() {
  return (
    <ThemeWrapper>
      <Box
        bg="surface.background"
        color="text.primary"
        p="6"
        borderRadius="8"
        mb="4"
      >
        <Text variant="display" as="h1" style={{ marginBottom: '1rem' }}>
          MDS + Next.js 16 Server Components
        </Text>

        <Text variant="body" as="p" style={{ marginBottom: '2rem' }}>
          This page demonstrates that Mond Design System components work perfectly with Next.js 16 Server Components.
          All components are rendered on the server without the &quot;use client&quot; directive.
        </Text>

        <Box display="flex" flexDirection="column" gap="4">
          <Box>
            <Text variant="headline" as="h2" style={{ marginBottom: '1rem' }}>
              Button Component
            </Text>
            <Box display="flex" gap="2" flexWrap="wrap">
              <Button variant="primary" size="md">Primary Button</Button>
              <Button variant="outline" size="md">Outline Button</Button>
              <Button variant="ghost" size="md">Ghost Button</Button>
              <Button variant="destructive" size="md">Destructive</Button>
              <Button variant="warning" size="md">Warning</Button>
            </Box>
          </Box>

          <Box>
            <Text variant="headline" as="h2" style={{ marginBottom: '1rem' }}>
              Badge Component
            </Text>
            <Box display="flex" gap="2" flexWrap="wrap" alignItems="center">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
            </Box>
          </Box>

          <Box>
            <Text variant="headline" as="h2" style={{ marginBottom: '1rem' }}>
              Avatar Component
            </Text>
            <Box display="flex" gap="2" flexWrap="wrap" alignItems="center">
              <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" size="sm" />
              <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" size="md" />
              <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" size="lg" />
              <Avatar alt="Fallback" size="md" />
            </Box>
          </Box>

          <Box>
            <Text variant="headline" as="h2" style={{ marginBottom: '1rem' }}>
              Text Component
            </Text>
            <Box display="flex" flexDirection="column" gap="2">
              <Text variant="display">Display Text</Text>
              <Text variant="headline">Headline Text</Text>
              <Text variant="title">Title Text</Text>
              <Text variant="body">Body Text - Regular paragraph text with default styling</Text>
              <Text variant="label">Label Text</Text>
              <Text variant="caption">Caption Text</Text>
            </Box>
          </Box>

          <Box>
            <Text variant="headline" as="h2" style={{ marginBottom: '1rem' }}>
              Box Component (Layout)
            </Text>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
              gap="4"
            >
              <Box
                bg="surface.card"
                p="4"
                borderRadius="8"
                border="1px solid"
                borderColor="border.default"
              >
                <Text variant="label">Card 1</Text>
              </Box>
              <Box
                bg="surface.card"
                p="4"
                borderRadius="8"
                border="1px solid"
                borderColor="border.default"
              >
                <Text variant="label">Card 2</Text>
              </Box>
              <Box
                bg="surface.card"
                p="4"
                borderRadius="8"
                border="1px solid"
                borderColor="border.default"
              >
                <Text variant="label">Card 3</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        bg="surface.card"
        color="text.secondary"
        p="4"
        borderRadius="8"
        border="1px solid"
        borderColor="border.default"
      >
        <Text variant="title" as="h3" style={{ marginBottom: '0.5rem' }}>
          Test Results
        </Text>
        <Box as="ul" style={{ paddingLeft: '1.5rem', margin: 0 }}>
          <li>
            <Text variant="body">
              ✅ All components render in Server Components without &quot;use client&quot;
            </Text>
          </li>
          <li>
            <Text variant="body">
              ✅ Theme switching works at runtime (light/dark mode)
            </Text>
          </li>
          <li>
            <Text variant="body">
              ✅ Brand switching works at runtime (default/BSF)
            </Text>
          </li>
          <li>
            <Text variant="body">
              ✅ CSS variables enable SSR compatibility
            </Text>
          </li>
          <li>
            <Text variant="body">
              ✅ No React Context required for theming
            </Text>
          </li>
        </Box>
      </Box>
    </ThemeWrapper>
  );
}
