import React from 'react';
import { Meta } from '@storybook/react';
import { colors, fontFamilies } from '../index';

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { colors } from '@mond-design-system/theme/tokens';

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: colors.primary[500],
        color: colors.white,
        padding: '16px',
        borderRadius: '8px',
        border: \`2px solid \${colors.primary[600]}\`,
      }}
    >
      <h2 style={{ color: colors.primary[100] }}>Primary Card</h2>
      <p style={{ color: colors.gray[300] }}>Using design system colors</p>
    </div>
  );
}
\`\`\`

Color design tokens provide a comprehensive palette with semantic naming and consistent color relationships across the design system.

**Key Features:**
- 🎨 Comprehensive color palette with semantic naming
- 🌈 Multiple color scales (50-900) for each color family
- 🌑 Built-in dark mode support
- 📈 Accessible color contrast ratios
- 🎯 Primary, secondary, and semantic color groups
- 🔄 Consistent color relationships and harmonies
- 🗺️ CSS custom properties support
- ♿ WCAG compliant color combinations
        `,
      },
    },
  },
};

export default meta;

const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div
      style={{
        width: '100%',
        height: '100px',
        backgroundColor: color,
        borderRadius: '4px',
        marginBottom: '0.5rem',
      }}
    />
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ fontFamily: fontFamilies.sans }}>{name}</div>
      <div style={{ color: '#666', fontFamily: fontFamilies.sans }}>{color}</div>
    </div>
  </div>
);

const ColorGroup = ({ name, colors }: { name: string; colors: Record<string, unknown> }) => {
  const renderColorValue = (key: string, value: unknown, parentKey?: string): React.ReactNode[] => {
    if (typeof value === 'string') {
      const displayName = parentKey ? `${parentKey}-${key}` : `${name}-${key}`;
      return [<ColorSwatch key={displayName} color={value} name={displayName} />];
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value).flatMap(([nestedKey, nestedValue]) =>
        renderColorValue(nestedKey, nestedValue, key)
      );
    }
    return [];
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontFamily: fontFamilies.sans }}>{name}</h2>
      <div style={{ display: 'flex', flexDirection:'column'}}>
        {Object.entries(colors).flatMap(([key, value]) => renderColorValue(key, value))}
      </div>
    </div>
  );
};

// Helper to group colors by prefix
const groupColorsByPrefix = (colors: Record<string, string>): Record<string, Record<string, string>> => {
  const grouped: Record<string, Record<string, string>> = {};

  for (const [key, value] of Object.entries(colors)) {
    // Extract prefix (e.g., 'blue' from 'blue50')
    const prefix = key.replace(/\d+$/, '');

    if (!grouped[prefix]) {
      grouped[prefix] = {};
    }

    grouped[prefix][key] = value;
  }

  return grouped;
};

const colorGroups = groupColorsByPrefix(colors);

// Individual color group stories to avoid exceeding Chromatic's size limit
export const Blue = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="blue" colors={colorGroups.blue || {}} />
  </div>
);

export const Gray = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="gray" colors={colorGroups.gray || {}} />
  </div>
);

export const Red = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="red" colors={colorGroups.red || {}} />
  </div>
);

export const Green = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="green" colors={colorGroups.green || {}} />
  </div>
);

export const Amber = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="amber" colors={colorGroups.amber || {}} />
  </div>
);

export const BrandColors = () => (
  <div style={{ padding: '2rem' }}>
    <ColorGroup name="brand" colors={colorGroups.brand || {}} />
  </div>
);

export const BaseColors = () => {
  const colorsByPrefix = groupColorsByPrefix(colors);
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontFamily: fontFamilies.sans }}>Base Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <ColorSwatch color={colorsByPrefix.white?.['white50'] || colors.white50} name="white" />
        <ColorSwatch color={colorsByPrefix.black?.['black900'] || colors.black900} name="black" />
        <ColorSwatch color={colorsByPrefix.slate?.['slate900'] || colors.slate900} name="slate" />
      </div>
    </div>
  );
};
