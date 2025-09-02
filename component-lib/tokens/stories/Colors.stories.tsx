import React from 'react';
import { Meta } from '@storybook/react';
import { colors, fontFamilies } from '../index';

const meta: Meta = {
  title: 'Tokens/Colors',
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

const ColorGroup = ({ name, colors }: { name: string; colors: Record<string, any> }) => {
  const renderColorValue = (key: string, value: any, parentKey?: string): React.ReactNode[] => {
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

export const All = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '2rem', fontFamily: fontFamilies.sans }}>Color Tokens</h1>
    {Object.entries(colors).map(([name, shades]) => (
      <ColorGroup key={name} name={name} colors={shades as Record<string, any>} />
    ))}
  </div>
);
