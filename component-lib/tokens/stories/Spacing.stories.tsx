import { Meta } from '@storybook/react';
import { spacing, fontFamilies } from '../index';

const meta: Meta = {
  title: 'Tokens/Spacing',
  parameters: {
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { spacing } from '@mond-design-system/theme/tokens';

function MyComponent() {
  return (
    <div
      style={{
        padding: spacing[4], // 16px
        margin: spacing[2], // 8px
        gap: spacing[3], // 12px
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          marginBottom: spacing[6], // 24px
          paddingX: spacing[8], // 32px
          paddingY: spacing[4], // 16px
        }}
      >
        Content with consistent spacing
      </div>
      <div style={{ marginTop: spacing[12] }}> {/* 48px */}
        More spaced content
      </div>
    </div>
  );
}
\`\`\`

Spacing design tokens provide a consistent spatial system based on a mathematical scale for margins, padding, and layout spacing throughout the design system.

**Key Features:**
- 📏 Mathematical spacing scale (0, 1, 2, 4, 6, 8, 12, 16, 20, 24...)
- 📈 Base-4 and base-8 spacing system
- 📱 Responsive spacing consistency
- 🎨 Visual rhythm and hierarchy through spacing
- 🗺️ Pixel-perfect spacing values
- 🔧 Easy integration with layout components
- 🎯 Semantic spacing conventions
- ⚡ Performance-optimized spacing system
        `,
      },
    },
  },
};

export default meta;

const SpacingBlock = ({ size, value }: { size: string; value: string }) => (
  <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div
      style={{
        width: value,
        height: '40px',
        backgroundColor: '#1890ff',
        borderRadius: '4px',
      }}
    />
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ fontFamily: fontFamilies.sans }}>spacing-{size}</div>
      <div style={{ color: '#666', fontFamily: fontFamilies.sans }}>{value}</div>
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem', fontFamily: fontFamilies.sans }}>Spacing Tokens</h1>
    <div>
      {Object.entries(spacing).map(([size, value]) => (
        <SpacingBlock key={size} size={size} value={value} />
      ))}
    </div>
  </div>
);
