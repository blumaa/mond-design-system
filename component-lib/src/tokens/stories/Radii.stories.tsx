import { Meta } from '@storybook/react';
import { radii, fontFamilies } from '../index';

const meta: Meta = {
  title: 'Tokens/Radii',
  parameters: {
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { radii } from '@mond-design-system/theme/tokens';

function MyComponent() {
  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        backgroundColor: '#4f46e5',
        borderRadius: radii.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      Rounded
    </div>
  );
}
\`\`\`

Border radius design tokens provide consistent rounded corners and shape definitions throughout the design system.

**Key Features:**
- 🗔️ Consistent corner rounding system
- 📏 Multiple radius sizes (none, xs, sm, md, lg, xl, full)
- 🔸 Perfect circles with 'full' radius
- 📱 Responsive radius scaling
- 🎨 Visual hierarchy through radius variation
- 🗺️ CSS-ready border-radius values
- 🔧 Easy integration with components
- 🎯 Semantic naming convention
        `,
      },
    },
  },
};

export default meta;

const RadiusExample = ({ name, radius }: { name: string; radius: string }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div
      style={{
        width: '200px',
        height: '100px',
        backgroundColor: '#1890ff',
        borderRadius: radius,
        marginBottom: '1rem',
      }}
    />
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ fontFamily: fontFamilies.sans }}>{name}</div>
      <div style={{ color: '#666', fontFamily: fontFamilies.sans }}>{radius}</div>
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem', fontFamily: fontFamilies.sans }}>Border Radius Tokens</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
      {Object.entries(radii).map(([name, radius]) => (
        <RadiusExample key={name} name={name} radius={radius} />
      ))}
    </div>
  </div>
);
