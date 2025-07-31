import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useGlobals } from '@storybook/preview-api';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    corners: {
      control: { type: 'select' },
      options: ['default', 'rounded'],
    },
    iconOnly: {
      control: { type: 'boolean' },
      description: 'Icon-only button with no text',
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
      description: 'Button content (text or icon)',
    },
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story, context) => {
      const [globals] = useGlobals();
      const isDark = globals.backgrounds?.value === '#333333' || globals.theme === 'dark';
      
      // Override the isDarkMode prop based on Storybook theme
      const storyArgs = {
        ...context.args,
        isDarkMode: isDark,
      };
      
      return (
        <div
          style={{
            padding: '3rem',
            backgroundColor: isDark ? '#27374D' : '#F2F3F4',
            borderRadius: '8px',
          }}
        >
          <Story args={storyArgs} />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    corners: 'default',
    children: 'Button',
    iconOnly: false,
    disabled: false,
  },
};
