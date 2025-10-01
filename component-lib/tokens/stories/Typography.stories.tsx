import { Meta } from '@storybook/react';
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacings } from '../index';

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: {
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { fontFamilies, fontSizes, fontWeights, lineHeights } from '@mond-design-system/theme/tokens';

function MyComponent() {
  return (
    <div>
      <h1
        style={{
          fontFamily: fontFamilies.sans,
          fontSize: fontSizes['3xl'],
          fontWeight: fontWeights.bold,
          lineHeight: lineHeights.tight,
          marginBottom: '16px',
        }}
      >
        Design System Heading
      </h1>
      <p
        style={{
          fontFamily: fontFamilies.sans,
          fontSize: fontSizes.md,
          fontWeight: fontWeights.normal,
          lineHeight: lineHeights.normal,
        }}
      >
        This paragraph uses consistent typography tokens for readable, scalable text.
      </p>
      <code
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: fontSizes.sm,
        }}
      >
        Code snippet with monospace font
      </code>
    </div>
  );
}
\`\`\`

Typography design tokens provide consistent text styling with font families, sizes, weights, line heights, and letter spacing throughout the design system.

**Key Features:**
- 🔤 Comprehensive type scale with semantic sizing
- 📄 Font family system (sans, serif, mono)
- ⚖️ Font weight variations (thin to black)
- 📏 Line height system for optimal readability
- 🔠 Letter spacing for improved legibility
- 📱 Responsive typography scaling
- 🎯 Semantic naming conventions
- 🖨️ CSS-ready typography properties
        `,
      },
    },
  },
};

export default meta;

const SampleText = "The quick brown fox jumps over the lazy dog";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '3rem' }}>
    <h2 style={{ marginBottom: '1rem', fontFamily: fontFamilies.sans }}>{title}</h2>
    {children}
  </div>
);

const FontFamilyExample = ({ name, family }: { name: string; family: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ fontFamily: family, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {family}
    </div>
  </div>
);

const FontSizeExample = ({ name, size }: { name: string; size: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ fontSize: size, fontFamily: fontFamilies.sans, marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {size}
    </div>
  </div>
);

const FontWeightExample = ({ name, weight }: { name: string; weight: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ fontWeight: weight, fontSize: '1.25rem', fontFamily: fontFamilies.sans, marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {weight}
    </div>
  </div>
);

const LineHeightExample = ({ name, height }: { name: string; height: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div 
      style={{ 
        lineHeight: height, 
        fontSize: '1.25rem', 
        fontFamily: fontFamilies.sans,
        marginBottom: '0.5rem',
        backgroundColor: '#f0f0f0',
        padding: '1rem',
      }}
    >
      {SampleText}<br/>{SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {height}
    </div>
  </div>
);

const LetterSpacingExample = ({ name, spacing }: { name: string; spacing: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ letterSpacing: spacing, fontSize: '1.25rem', fontFamily: fontFamilies.sans, marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {spacing}
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem', fontFamily: fontFamilies.sans }}>Typography Tokens</h1>

    <Section title="Font Families">
      {Object.entries(fontFamilies).map(([name, family]) => (
        <FontFamilyExample key={name} name={name} family={family} />
      ))}
    </Section>

    <Section title="Font Sizes">
      {Object.entries(fontSizes).map(([name, size]) => (
        <FontSizeExample key={name} name={name} size={size} />
      ))}
    </Section>

    <Section title="Font Weights">
      {Object.entries(fontWeights).map(([name, weight]) => (
        <FontWeightExample key={name} name={name} weight={weight} />
      ))}
    </Section>

    <Section title="Line Heights">
      {Object.entries(lineHeights).map(([name, height]) => (
        <LineHeightExample key={name} name={name} height={height} />
      ))}
    </Section>

    <Section title="Letter Spacing">
      {Object.entries(letterSpacings).map(([name, spacing]) => (
        <LetterSpacingExample key={name} name={name} spacing={spacing} />
      ))}
    </Section>
  </div>
);
