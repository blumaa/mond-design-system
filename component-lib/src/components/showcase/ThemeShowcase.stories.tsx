import type { Meta, StoryObj } from '@storybook/react';
import { useTheme } from 'styled-components';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Text } from '../Text';
import { Heading } from '../Heading';
import { Box } from '../Box';
import type { Theme } from '../../themes';

const meta: Meta = {
  title: 'Theme System/Theme Showcase',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

export const ColorPalette: Story = {
  render: () => {
    const theme = useTheme() as Theme;

    return (
      <Box padding="6">
        <Box marginBottom="6">
          <Heading level={1}>Color Palette</Heading>
        </Box>

        <Box marginBottom="4">
          <Heading level={2}>Brand Colors</Heading>
        </Box>
        <Box display="flex" gap="4" marginBottom="8" flexWrap="wrap">
          <ColorSwatch label="Primary 500" color={theme.colors.brandPrimary500} />
          <ColorSwatch label="Primary 600" color={theme.colors.brandPrimary600} />
          <ColorSwatch label="Primary 700" color={theme.colors.brandPrimary700} />
          <ColorSwatch label="Secondary 500" color={theme.colors.brandSecondary500} />
          <ColorSwatch label="Success 500" color={theme.colors.brandSuccess500} />
          <ColorSwatch label="Warning 500" color={theme.colors.brandWarning500} />
          <ColorSwatch label="Error 500" color={theme.colors.brandError500} />
        </Box>

        <Box marginBottom="4">
          <Heading level={2}>Semantic Colors (Theme-Aware)</Heading>
        </Box>
        <Box display="flex" gap="4" marginBottom="8" flexWrap="wrap">
          <ColorSwatch label="Text Primary" color={theme.colors.textPrimary} />
          <ColorSwatch label="Text Secondary" color={theme.colors.textSecondary} />
          <ColorSwatch label="Text Link" color={theme.colors.textLink} />
          <ColorSwatch label="Surface Background" color={theme.colors.surfaceBackground} />
          <ColorSwatch label="Surface Elevated" color={theme.colors.surfaceElevated} />
          <ColorSwatch label="Border Default" color={theme.colors.borderDefault} />
        </Box>

        <Text variant="body" semantic="secondary">
          Switch between light/dark themes and default/BSF brands using the toolbar to see these colors change!
        </Text>
      </Box>
    );
  },
};

export const ComponentShowcase: Story = {
  render: () => (
    <Box padding="6">
      <Box marginBottom="6">
        <Heading level={1}>Component Showcase</Heading>
      </Box>

      <Box marginBottom="8">
        <Box marginBottom="4">
          <Heading level={2}>Buttons</Heading>
        </Box>
        <Box display="flex" gap="3" flexWrap="wrap">
          <Button variant="primary">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="warning">Warning Button</Button>
        </Box>
      </Box>

      <Box marginBottom="8">
        <Box marginBottom="4">
          <Heading level={2}>Badges</Heading>
        </Box>
        <Box display="flex" gap="3" flexWrap="wrap">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </Box>
      </Box>

      <Box marginBottom="8">
        <Box marginBottom="4">
          <Heading level={2}>Typography</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="3">
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Text variant="body">Body text - Regular weight</Text>
          <Text variant="body" weight="semibold">Body text - Semibold</Text>
          <Text variant="body-sm" semantic="secondary">Small body text - Secondary color</Text>
          <Text variant="body" semantic="link">Link text</Text>
        </Box>
      </Box>

      <Box marginBottom="8">
        <Box marginBottom="4">
          <Heading level={2}>Semantic Text Colors</Heading>
        </Box>
        <Box display="flex" flexDirection="column" gap="2">
          <Text semantic="primary">Primary text color</Text>
          <Text semantic="secondary">Secondary text color</Text>
          <Text semantic="success">Success text color</Text>
          <Text semantic="warning">Warning text color</Text>
          <Text semantic="error">Error text color</Text>
          <Text semantic="link">Link text color</Text>
        </Box>
      </Box>

      <Text variant="body" semantic="secondary">
        💡 These components automatically adapt to the selected theme and brand!
      </Text>
    </Box>
  ),
};

export const ThemeComparison: Story = {
  render: () => {
    const theme = useTheme() as Theme;

    return (
      <Box padding="6">
        <Box marginBottom="4">
          <Heading level={1}>Theme Comparison</Heading>
        </Box>
        <Box marginBottom="6">
          <Text variant="body" semantic="secondary">
            This view shows how components look in different themes. Use the theme toolbar to switch between light/dark modes.
          </Text>
        </Box>

        <Box
          padding="6"
          marginBottom="6"
          style={{
            backgroundColor: theme.colors.surfaceElevated,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.borderDefault}`
          }}
        >
          <Box marginBottom="4">
            <Heading level={2}>Sample Card</Heading>
          </Box>
          <Box marginBottom="4">
            <Text variant="body">
              This card demonstrates how surface colors, borders, and text adapt to the current theme.
              The background and text colors automatically switch based on the selected theme mode.
            </Text>
          </Box>
          <Box display="flex" gap="3">
            <Button variant="primary">Primary Action</Button>
            <Button variant="outline">Secondary Action</Button>
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="4">
          <InfoCard
            title="Default Brand"
            description="Features blue as the primary color with a professional appearance"
          />
          <InfoCard
            title="BSF Brand"
            description="Features green as the primary color for an eco-friendly feel"
          />
        </Box>
      </Box>
    );
  },
};

// Helper Components

function ColorSwatch({ label, color }: { label: string; color: string }) {
  const theme = useTheme() as Theme;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="2">
      <Box
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: color,
          borderRadius: '8px',
          border: `1px solid ${theme.colors.borderDefault}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      />
      <Text variant="caption" align="center" style={{ maxWidth: '80px' }}>
        {label}
      </Text>
    </Box>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  const theme = useTheme() as Theme;

  return (
    <Box
      padding="4"
      style={{
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: '8px',
        border: `1px solid ${theme.colors.borderDefault}`,
      }}
    >
      <Box marginBottom="2">
        <Heading level={3}>{title}</Heading>
      </Box>
      <Text variant="body-sm" semantic="secondary">{description}</Text>
      <Box marginTop="4">
        <Badge variant="primary">Primary</Badge>
      </Box>
    </Box>
  );
}
