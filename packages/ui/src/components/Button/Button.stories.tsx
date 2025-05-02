import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    isDarkMode: {
      control: { type: 'boolean' },
      description: 'Toggle between dark and light mode',
    },
    onClick: { action: 'clicked' },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.args.isDarkMode;
      return (
        <div
          style={{
            padding: '3rem',
            backgroundColor: isDark ? '#27374D' : '#F2F3F4',
            borderRadius: '8px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

const Template: Story = {
  render: (args) => <Button {...args} />,
};

export const Primary: Story = {
  ...Template,
  args: {
    variant: 'primary',
    children: 'Primary Button',
    isDarkMode: false,
  },
};

export const PrimaryDark: Story = {
  ...Template,
  args: {
    ...Primary.args,
    isDarkMode: true,
  },
};

export const Secondary: Story = {
  ...Template,
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    isDarkMode: false,
  },
};

export const SecondaryDark: Story = {
  ...Template,
  args: {
    ...Secondary.args,
    isDarkMode: true,
  },
};

export const Outline: Story = {
  ...Template,
  args: {
    variant: 'outline',
    children: 'Outline Button',
    isDarkMode: false,
  },
};

export const OutlineDark: Story = {
  ...Template,
  args: {
    ...Outline.args,
    isDarkMode: true,
  },
};

export const Ghost: Story = {
  ...Template,
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
    isDarkMode: false,
  },
};

export const GhostDark: Story = {
  ...Template,
  args: {
    ...Ghost.args,
    isDarkMode: true,
  },
};

export const Small: Story = {
  ...Template,
  args: {
    size: 'sm',
    children: 'Small Button',
    isDarkMode: false,
  },
};

export const Medium: Story = {
  ...Template,
  args: {
    size: 'md',
    children: 'Medium Button',
    isDarkMode: false,
  },
};

export const Large: Story = {
  ...Template,
  args: {
    size: 'lg',
    children: 'Large Button',
    isDarkMode: false,
  },
};

export const Disabled: Story = {
  ...Template,
  args: {
    disabled: true,
    children: 'Disabled Button',
    isDarkMode: false,
  },
};
