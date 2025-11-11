import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    imageSrc: {
      control: 'text',
      description: 'Image source URL',
    },
    imageAlt: {
      control: 'text',
      description: 'Image alt text',
    },
    tag: {
      control: 'text',
      description: 'Tag label',
    },
    date: {
      control: 'text',
      description: 'Date string',
    },
    imagePosition: {
      control: 'radio',
      options: ['top', 'left'],
      description: 'Position of the image',
    },
    background: {
      control: 'radio',
      options: ['default', 'subtle', 'emphasized'],
      description: 'Background variant',
    },
    href: {
      control: 'text',
      description: 'Link URL',
    },
    target: {
      control: 'text',
      description: 'Link target attribute',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    hoverable: {
      control: 'boolean',
      description: 'Show hover effect',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card with all basic elements
 */
export const Default: Story = {
  args: {
    title: 'Card Title',
    description: 'This is a description of the card content. It provides context about what the card represents.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Laptop on desk',
    tag: 'Technology',
    date: 'Jan 15, 2025',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card without image
 */
export const WithoutImage: Story = {
  args: {
    title: 'Text-Only Card',
    description: 'This card doesn\'t have an image, showing how the component adapts when no image is provided.',
    tag: 'Article',
    date: 'Jan 10, 2025',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with left-positioned image
 */
export const ImageLeft: Story = {
  args: {
    title: 'Horizontal Card',
    description: 'This card has the image positioned on the left side, creating a horizontal layout.',
    imageSrc: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    imageAlt: 'City skyline',
    tag: 'Featured',
    date: 'Jan 12, 2025',
    imagePosition: 'left',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card as a clickable link
 */
export const WithLink: Story = {
  args: {
    title: 'Clickable Card',
    description: 'This entire card is clickable and will navigate to the specified URL.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Team collaboration',
    tag: 'Guide',
    date: 'Jan 8, 2025',
    href: '#',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with custom call-to-action button
 */
export const WithCallToAction: Story = {
  args: {
    title: 'Get Started Today',
    description: 'Join thousands of users who are already benefiting from our platform.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Team meeting',
    callToAction: <Button variant="primary">Sign Up Now</Button>,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with secondary call-to-action
 */
export const WithSecondaryAction: Story = {
  args: {
    title: 'Learn More',
    description: 'Discover how our platform can help you achieve your goals.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Office workspace',
    tag: 'Tutorial',
    date: 'Jan 5, 2025',
    callToAction: <Button variant="outline">Read Article</Button>,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with badge overlay
 */
export const WithBadge: Story = {
  args: {
    title: 'Featured Article',
    description: 'This card has a badge overlay in the top-left corner to highlight special content.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Business presentation',
    tag: 'Premium',
    date: 'Jan 14, 2025',
    topLeftElement: <Badge variant="success" size="sm">New</Badge>,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with multiple overlays
 */
export const WithMultipleOverlays: Story = {
  args: {
    title: 'Special Offer',
    description: 'Limited time offer with special pricing and exclusive benefits.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Business team',
    tag: 'Promotion',
    date: 'Jan 16, 2025',
    topLeftElement: <Badge variant="error" size="sm">Sale</Badge>,
    topRightElement: <Badge variant="warning" size="sm">-50%</Badge>,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with subtle background
 */
export const SubtleBackground: Story = {
  args: {
    title: 'Subtle Card',
    description: 'This card uses a subtle background variant for a softer appearance.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Modern office',
    tag: 'Design',
    date: 'Jan 11, 2025',
    background: 'subtle',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Card with emphasized background
 */
export const EmphasizedBackground: Story = {
  args: {
    title: 'Emphasized Card',
    description: 'This card uses an emphasized background to stand out more prominently.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Team discussion',
    tag: 'Important',
    date: 'Jan 13, 2025',
    background: 'emphasized',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Disabled card
 */
export const Disabled: Story = {
  args: {
    title: 'Unavailable Content',
    description: 'This card is disabled and not interactive.',
    imageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    imageAlt: 'Workspace',
    tag: 'Archived',
    date: 'Dec 20, 2024',
    disabled: true,
    href: '#',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Minimal card with just title and description
 */
export const Minimal: Story = {
  args: {
    title: 'Simple Card',
    description: 'A minimal card with just the essential content.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Grid of cards demonstrating responsive layout
 */
export const CardGrid = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1200px',
    }}>
      <Card
        title="Design Systems"
        description="Building scalable and maintainable design systems for modern applications."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        imageAlt="Design"
        tag="Tutorial"
        date="Jan 15, 2025"
        href="#"
      />
      <Card
        title="Component Architecture"
        description="Best practices for structuring React components in large applications."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        imageAlt="Architecture"
        tag="Guide"
        date="Jan 14, 2025"
        href="#"
      />
      <Card
        title="TypeScript Tips"
        description="Advanced TypeScript techniques for type-safe React development."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        imageAlt="TypeScript"
        tag="Development"
        date="Jan 13, 2025"
        href="#"
        topLeftElement={<Badge variant="success" size="sm">New</Badge>}
      />
      <Card
        title="Accessibility First"
        description="Creating inclusive web experiences that work for everyone."
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
        imageAlt="Accessibility"
        tag="A11y"
        date="Jan 12, 2025"
        href="#"
      />
    </div>
  ),
};

/**
 * Horizontal cards in a list
 */
export const HorizontalList = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
      <Card
        title="Latest Update"
        description="Check out our newest features and improvements."
        imageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop"
        imageAlt="Update"
        imagePosition="left"
        tag="Release"
        date="Jan 16, 2025"
        href="#"
      />
      <Card
        title="Community Spotlight"
        description="Featuring amazing work from our community members."
        imageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop"
        imageAlt="Community"
        imagePosition="left"
        tag="Community"
        date="Jan 15, 2025"
        href="#"
      />
      <Card
        title="Developer Resources"
        description="Tools and resources to help you build better applications."
        imageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop"
        imageAlt="Resources"
        imagePosition="left"
        tag="Resources"
        date="Jan 14, 2025"
        href="#"
      />
    </div>
  ),
};
