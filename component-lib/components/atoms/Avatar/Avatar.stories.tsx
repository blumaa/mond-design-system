import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fallback: 'John Doe',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture',
    fallback: 'John Doe',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="xs" fallback="XS" />
        <span style={{ fontSize: '0.75rem' }}>XS</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="sm" fallback="SM" />
        <span style={{ fontSize: '0.75rem' }}>SM</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="md" fallback="MD" />
        <span style={{ fontSize: '0.75rem' }}>MD</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="lg" fallback="LG" />
        <span style={{ fontSize: '0.75rem' }}>LG</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="xl" fallback="XL" />
        <span style={{ fontSize: '0.75rem' }}>XL</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar size="2xl" fallback="2XL" />
        <span style={{ fontSize: '0.75rem' }}>2XL</span>
      </div>
    </div>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar fallback="Alice Johnson" />
      <Avatar fallback="Bob Smith" />
      <Avatar fallback="Carol Williams" />
      <Avatar fallback="David Brown" />
      <Avatar fallback="Eva Davis" />
    </div>
  ),
};

export const WithCustomFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Avatar>
        <span style={{ fontSize: '1.2em' }}>👤</span>
      </Avatar>
      <Avatar>
        <span style={{ fontSize: '1.2em' }}>🎭</span>
      </Avatar>
      <Avatar>
        <span style={{ fontSize: '1.2em' }}>🚀</span>
      </Avatar>
      <Avatar>
        <span style={{ fontSize: '1.2em' }}>⭐</span>
      </Avatar>
    </div>
  ),
};

export const ImageWithFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
          fallback="John Doe" 
        />
        <span style={{ fontSize: '0.75rem' }}>Valid Image</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar 
          src="https://broken-url.com/broken-image.jpg" 
          fallback="Jane Smith" 
        />
        <span style={{ fontSize: '0.75rem' }}>Broken Image</span>
      </div>
    </div>
  ),
};

export const UserProfiles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar 
          src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"
          fallback="Alice Johnson"
          size="md"
        />
        <div>
          <div style={{ fontWeight: '500' }}>Alice Johnson</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Product Designer</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          fallback="Bob Smith"
          size="md"
        />
        <div>
          <div style={{ fontWeight: '500' }}>Bob Smith</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Software Engineer</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar 
          fallback="Carol Williams"
          size="md"
        />
        <div>
          <div style={{ fontWeight: '500' }}>Carol Williams</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Project Manager</div>
        </div>
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face"
        fallback="Alice Johnson"
        size="md"
        style={{ marginLeft: '0px', zIndex: 4 }}
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        fallback="Bob Smith"
        size="md"
        style={{ marginLeft: '-8px', zIndex: 3 }}
      />
      <Avatar 
        fallback="Carol Williams"
        size="md"
        style={{ marginLeft: '-8px', zIndex: 2 }}
      />
      <Avatar 
        fallback="David Brown"
        size="md"
        style={{ marginLeft: '-8px', zIndex: 1 }}
      />
      <div style={{ 
        marginLeft: '-8px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#6b7280',
      }}>
        +5
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    fallback: 'Dark Mode',
    size: 'lg',
  },
  parameters: {
    theme: 'dark',
  },
};