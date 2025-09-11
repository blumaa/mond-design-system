import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';
import { useTheme } from '../../../providers/ThemeProvider';
import React from 'react';

const DebugBadge = () => {
  const theme = useTheme();
  
  // Get the actual resolved colors
  const primaryBg = theme('interactive.primary.background');
  const primaryText = theme('interactive.primary.text');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3>Brand Debug Info</h3>
        <p><strong>Primary Background:</strong> <code>{primaryBg}</code></p>
        <p><strong>Primary Text:</strong> <code>{primaryText}</code></p>
        <div 
          style={{ 
            width: '50px', 
            height: '50px', 
            backgroundColor: primaryBg,
            border: '1px solid black',
            display: 'inline-block',
            marginLeft: '10px'
          }}
        />
      </div>
      
      <div>
        <h3>Actual Badge</h3>
        <Badge variant="primary">Primary Badge</Badge>
      </div>
      
      <div>
        <h3>Expected Colors by Brand</h3>
        <ul>
          <li><strong>MOND (default):</strong> Blue-ish (#0ea5e9 or similar)</li>
          <li><strong>CYPHER:</strong> Neon Green (#00e085)</li>
          <li><strong>FLUX:</strong> Purple/Pink (#9333ea or similar)</li>
        </ul>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Debug/Brand Debug',
  component: DebugBadge,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BrandColors: Story = {};