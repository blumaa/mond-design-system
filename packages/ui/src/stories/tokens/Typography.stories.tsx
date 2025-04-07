import React from 'react';
import { Meta } from '@storybook/react';
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacings } from '@comp-lib-proto/tokens';

const meta: Meta = {
  title: 'Tokens/Typography',
};

export default meta;

const SampleText = "The quick brown fox jumps over the lazy dog";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '3rem' }}>
    <h2 style={{ marginBottom: '1rem' }}>{title}</h2>
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
    <div style={{ fontSize: size, marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {size}
    </div>
  </div>
);

const FontWeightExample = ({ name, weight }: { name: string; weight: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div style={{ fontWeight: weight, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
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
    <div style={{ letterSpacing: spacing, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
      {SampleText}
    </div>
    <div style={{ fontFamily: 'monospace', color: '#666' }}>
      {name}: {spacing}
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem' }}>Typography Tokens</h1>

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
