import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An enhanced image component with loading states, error handling, fallback support, and aspect ratio controls. Provides a better user experience than the standard HTML img element.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'The URL of the image to display',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for screen readers and when image fails to load',
    },
    width: {
      control: 'text',
      description: 'Width of the image container',
    },
    height: {
      control: 'text',
      description: 'Height of the image container',
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'How the image should be resized to fit its container',
    },
    fallbackSrc: {
      control: 'text',
      description: 'Fallback image URL to show if the primary image fails to load',
    },
    showLoadingSpinner: {
      control: 'boolean',
      description: 'Whether to show a loading spinner while the image loads',
    },
    aspectRatio: {
      control: 'select',
      options: ['1:1', '4:3', '16:9', '3:2', 'auto'],
      description: 'Aspect ratio constraint for the image container',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: 'Border radius from design tokens',
    },
    loading: {
      control: 'select',
      options: ['eager', 'lazy'],
      description: 'Loading behavior for the image',
    },
    isDarkMode: {
      control: 'boolean',
      description: 'Whether to use dark theme colors for loading and error states',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Beautiful mountain landscape',
  },
};

export const AspectRatios: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
          alt="Square aspect ratio"
          aspectRatio="1:1"
          borderRadius="lg"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>1:1 (Square)</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
          alt="4:3 aspect ratio"
          aspectRatio="4:3"
          borderRadius="lg"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>4:3 (Standard)</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
          alt="16:9 aspect ratio"
          aspectRatio="16:9"
          borderRadius="lg"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>16:9 (Widescreen)</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=266&fit=crop"
          alt="3:2 aspect ratio"
          aspectRatio="3:2"
          borderRadius="lg"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>3:2 (Photography)</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Images can maintain specific aspect ratios regardless of the original image dimensions.',
      },
    },
  },
};

export const ObjectFit: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
          alt="Cover fit"
          fit="cover"
          aspectRatio="1:1"
          width="150px"
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Cover</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
          alt="Contain fit"
          fit="contain"
          aspectRatio="1:1"
          width="150px"
          borderRadius="md"
          style={{ backgroundColor: '#f3f4f6' }}
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Contain</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
          alt="Fill fit"
          fit="fill"
          aspectRatio="1:1"
          width="150px"
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Fill</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop"
          alt="Scale-down fit"
          fit="scale-down"
          aspectRatio="1:1"
          width="150px"
          borderRadius="md"
          style={{ backgroundColor: '#f3f4f6' }}
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Scale Down</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different object-fit values control how images are resized within their containers.',
      },
    },
  },
};

export const BorderRadius: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=150&h=150&fit=crop"
          alt="No radius"
          borderRadius="none"
          aspectRatio="1:1"
          width="100px"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>None</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=150&h=150&fit=crop"
          alt="Small radius"
          borderRadius="sm"
          aspectRatio="1:1"
          width="100px"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Small</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=150&h=150&fit=crop"
          alt="Medium radius"
          borderRadius="md"
          aspectRatio="1:1"
          width="100px"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Medium</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=150&h=150&fit=crop"
          alt="Large radius"
          borderRadius="lg"
          aspectRatio="1:1"
          width="100px"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Large</div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Image
          src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=150&h=150&fit=crop"
          alt="Full radius"
          borderRadius="full"
          aspectRatio="1:1"
          width="100px"
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Full</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Border radius options from the design token system, including circular images with "full" radius.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center', width: '200px' }}>
        <Image
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="Loading with spinner"
          aspectRatio="4:3"
          showLoadingSpinner={true}
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
          Loading with Spinner
        </div>
      </div>
      
      <div style={{ textAlign: 'center', width: '200px' }}>
        <Image
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt="Loading with placeholder"
          aspectRatio="4:3"
          showLoadingSpinner={false}
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
          Loading with Placeholder
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different loading state presentations: with spinner or simple placeholder.',
      },
    },
  },
};

export const ErrorHandling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center', width: '200px' }}>
        <Image
          src="https://nonexistent-url.com/image.jpg"
          alt="Image with error"
          aspectRatio="4:3"
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
          Failed Image (No Fallback)
        </div>
      </div>
      
      <div style={{ textAlign: 'center', width: '200px' }}>
        <Image
          src="https://nonexistent-url.com/image.jpg"
          fallbackSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=225&fit=crop"
          alt="Image with fallback"
          aspectRatio="4:3"
          borderRadius="md"
        />
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
          Failed Image (With Fallback)
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error handling with and without fallback images. Failed images show a helpful error state.',
      },
    },
  },
};

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#ffffff', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 16px 0' }}>Light Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '150px' }}>
            <Image
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Loading state light"
              aspectRatio="4:3"
              showLoadingSpinner={false}
              isDarkMode={false}
              borderRadius="md"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Loading</div>
          </div>
          
          <div style={{ width: '150px' }}>
            <Image
              src="https://nonexistent-url.com/image.jpg"
              alt="Error state light"
              aspectRatio="4:3"
              isDarkMode={false}
              borderRadius="md"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>Error</div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1f2937', 
        borderRadius: '8px',
        color: '#f9fafb',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#f9fafb' }}>Dark Theme</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '150px' }}>
            <Image
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Loading state dark"
              aspectRatio="4:3"
              showLoadingSpinner={false}
              isDarkMode={true}
              borderRadius="md"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>Loading</div>
          </div>
          
          <div style={{ width: '150px' }}>
            <Image
              src="https://nonexistent-url.com/image.jpg"
              alt="Error state dark"
              aspectRatio="4:3"
              isDarkMode={true}
              borderRadius="md"
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>Error</div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading and error states automatically adapt to light and dark themes.',
      },
    },
  },
};

export const ResponsiveGallery: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '16px',
      maxWidth: '800px'
    }}>
      {[
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1466854076813-4aa9c1a7c0a6?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=200&fit=crop',
      ].map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          aspectRatio="3:2"
          borderRadius="lg"
          loading="lazy"
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a responsive image gallery using the Image component with consistent aspect ratios and lazy loading.',
      },
    },
  },
};

export const ProfileAvatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Image
        src="https://images.unsplash.com/photo-1494790108755-2616c8faf9e5?w=64&h=64&fit=crop"
        alt="Profile avatar small"
        aspectRatio="1:1"
        borderRadius="full"
        width="64px"
      />
      
      <Image
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
        alt="Profile avatar medium"
        aspectRatio="1:1"
        borderRadius="full"
        width="80px"
      />
      
      <Image
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop"
        alt="Profile avatar large"
        aspectRatio="1:1"
        borderRadius="full"
        width="96px"
      />
      
      <Image
        src="https://nonexistent-url.com/avatar.jpg"
        fallbackSrc="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=112&h=112&fit=crop"
        alt="Profile avatar with fallback"
        aspectRatio="1:1"
        borderRadius="full"
        width="112px"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile avatar examples with circular cropping and fallback handling.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain landscape',
    aspectRatio: 'auto',
    fit: 'cover',
    borderRadius: 'none',
    showLoadingSpinner: true,
    loading: 'lazy',
    isDarkMode: false,
    width: '300px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to experiment with different image configurations.',
      },
    },
  },
};