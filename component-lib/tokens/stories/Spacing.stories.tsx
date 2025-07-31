import React from 'react';
import { Meta } from '@storybook/react';
import { spacing, fontFamilies } from '../index';

const meta: Meta = {
  title: 'Tokens/Spacing',
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
