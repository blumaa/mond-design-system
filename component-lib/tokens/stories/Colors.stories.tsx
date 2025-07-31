import React from 'react';
import { Meta } from '@storybook/react';
import { colors } from '../index';

const meta: Meta = {
  title: 'Tokens/Colors',
};

export default meta;

const ColorSwatch = ({ color, name }: { color: string; name: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div
      style={{
        width: '200px',
        height: '100px',
        backgroundColor: color,
        borderRadius: '4px',
        marginBottom: '0.5rem',
      }}
    />
    <div style={{ fontFamily: 'monospace' }}>
      <div>{name}</div>
      <div style={{ color: '#666' }}>{color}</div>
    </div>
  </div>
);

const ColorGroup = ({ name, colors }: { name: string; colors: Record<string, string> }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ marginBottom: '1rem' }}>{name}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {Object.entries(colors).map(([shade, value]) => (
        <ColorSwatch key={`${name}-${shade}`} color={value} name={`${name}-${shade}`} />
      ))}
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem' }}>Color Tokens</h1>
    {Object.entries(colors).map(([name, shades]) => (
      <ColorGroup key={name} name={name} colors={shades as Record<string, string>} />
    ))}
  </div>
);
