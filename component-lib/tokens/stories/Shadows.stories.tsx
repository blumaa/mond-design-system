import React from 'react';
import { Meta } from '@storybook/react';
import { shadows } from '../index';

const meta: Meta = {
  title: 'Tokens/Shadows',
};

export default meta;

const ShadowExample = ({ name, shadow }: { name: string; shadow: string }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div
      style={{
        width: '200px',
        height: '100px',
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: shadow,
        marginBottom: '1rem',
      }}
    />
    <div style={{ fontFamily: 'monospace' }}>
      <div>{name}</div>
      <div style={{ color: '#666' }}>{shadow}</div>
    </div>
  </div>
);

export const All = () => (
  <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
    <h1 style={{ marginBottom: '2rem' }}>Shadow Tokens</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
      {Object.entries(shadows).map(([name, shadow]) => (
        <ShadowExample key={name} name={name} shadow={shadow} />
      ))}
    </div>
  </div>
);
