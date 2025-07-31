import React from 'react';
import { Meta } from '@storybook/react';
import { radii } from '../index';

const meta: Meta = {
  title: 'Tokens/Radii',
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
      <div>{name}</div>
      <div style={{ color: '#666' }}>{radius}</div>
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem' }}>Border Radius Tokens</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
      {Object.entries(radii).map(([name, radius]) => (
        <RadiusExample key={name} name={name} radius={radius} />
      ))}
    </div>
  </div>
);
