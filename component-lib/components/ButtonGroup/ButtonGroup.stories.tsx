import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button/Button';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    gap: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    corners: {
      control: 'select',
      options: ['default', 'rounded'],
    },
    alignContent: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    isDarkMode: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Primary (Default)</h3>
        <ButtonGroup variant="primary">
          <Button>Save</Button>
          <Button>Cancel</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Outline</h3>
        <ButtonGroup variant="outline">
          <Button>Save</Button>
          <Button>Cancel</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Ghost</h3>
        <ButtonGroup variant="ghost">
          <Button>Save</Button>
          <Button>Cancel</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Small</h3>
        <ButtonGroup size="sm">
          <Button>Small</Button>
          <Button>Buttons</Button>
          <Button>Group</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Medium (Default)</h3>
        <ButtonGroup size="md">
          <Button>Medium</Button>
          <Button>Buttons</Button>
          <Button>Group</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Large</h3>
        <ButtonGroup size="lg">
          <Button>Large</Button>
          <Button>Buttons</Button>
          <Button>Group</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const CustomGap: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Tight Gap (4px)</h3>
        <ButtonGroup gap="4px">
          <Button>Tight</Button>
          <Button>Gap</Button>
          <Button>Group</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Wide Gap (2rem)</h3>
        <ButtonGroup gap="2rem">
          <Button>Wide</Button>
          <Button>Gap</Button>
          <Button>Group</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const OverridingIndividualButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Mixed Variants</h3>
        <ButtonGroup variant="outline">
          <Button>Inherit Outline</Button>
          <Button variant="primary">Override Primary</Button>
          <Button>Inherit Outline</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Mixed Sizes</h3>
        <ButtonGroup size="md">
          <Button>Medium</Button>
          <Button size="lg">Large Override</Button>
          <Button>Medium</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const ActionGroups: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Form Actions</h3>
        <ButtonGroup>
          <Button variant="primary">Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Navigation</h3>
        <ButtonGroup variant="ghost">
          <Button>← Previous</Button>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>Next →</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '14px', fontWeight: 600 }}>Toolbar Actions</h3>
        <ButtonGroup variant="outline" size="sm">
          <Button>✂️ Cut</Button>
          <Button>📋 Copy</Button>
          <Button>📌 Paste</Button>
          <Button>↺ Undo</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div style={{ 
      backgroundColor: '#1a1a1a', 
      padding: '2rem', 
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Primary
        </h3>
        <ButtonGroup isDarkMode>
          <Button>Save</Button>
          <Button>Cancel</Button>
          <Button>Delete</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Outline
        </h3>
        <ButtonGroup variant="outline" isDarkMode>
          <Button>Edit</Button>
          <Button>Share</Button>
          <Button>More</Button>
        </ButtonGroup>
      </div>
      
      <div>
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white' 
        }}>
          Dark Mode Vertical
        </h3>
        <ButtonGroup orientation="vertical" variant="ghost" isDarkMode>
          <Button>Dashboard</Button>
          <Button>Settings</Button>
          <Button>Profile</Button>
          <Button>Logout</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#1a1a1a' }],
    },
  },
};

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    gap: '8px',
    variant: 'primary',
    size: 'md',
    corners: 'default',
    alignContent: 'center',
    isDarkMode: false,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
};