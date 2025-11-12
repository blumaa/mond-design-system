import type { Meta, StoryObj } from '@storybook/react';
import { Carousel, CarouselItem } from './Carousel';
import { Button } from '../Button/Button';

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Carousel, CarouselItem } from '@mond-design-system/theme';

function MyComponent() {
  const items: CarouselItem[] = [
    {
      id: '1',
      content: <div style={{ padding: '40px', background: '#f0f0f0', textAlign: 'center' }}>Slide 1</div>
    },
    {
      id: '2',
      content: <div style={{ padding: '40px', background: '#e0e0e0', textAlign: 'center' }}>Slide 2</div>
    },
    {
      id: '3',
      content: <div style={{ padding: '40px', background: '#d0d0d0', textAlign: 'center' }}>Slide 3</div>
    },
  ];

  return (
    <Carousel
      items={items}
      showArrows={true}
      showIndicators={true}
      autoPlay={true}
      autoPlayInterval={3000}
      pauseOnHover={true}
      infinite={true}
      itemsToShow={1}
      onSlideChange={(index) => console.log('Current slide:', index)}
    />
  );
}
\`\`\`

A flexible carousel/slider component that supports single or multiple items, auto-play, keyboard navigation, and various customization options.

**Key Features:**
- 🔄 Auto-play with configurable intervals
- 🖱️ Hover to pause functionality
- 🔁 Infinite loop support
- 📊 Multiple items display with gap control
- 🎯 Navigation arrows and dot indicators
- ⌨️ Keyboard navigation (arrow keys)
- 🎨 Customizable arrow and indicator positions
- 🌑 Dark mode compatibility
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Array of carousel items to display',
      control: 'object',
    },
    showArrows: {
      description: 'Whether to show navigation arrows',
      control: 'boolean',
    },
    showIndicators: {
      description: 'Whether to show dot indicators',
      control: 'boolean',
    },
    autoPlay: {
      description: 'Whether to auto-play the carousel',
      control: 'boolean',
    },
    autoPlayInterval: {
      description: 'Auto-play interval in milliseconds',
      control: 'number',
    },
    pauseOnHover: {
      description: 'Whether to pause auto-play on hover',
      control: 'boolean',
    },
    infinite: {
      description: 'Whether the carousel should loop infinitely',
      control: 'boolean',
    },
    itemsToShow: {
      description: 'Number of items to show at once',
      control: 'number',
    },
    itemGap: {
      description: 'Gap between items when showing multiple',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg'],
    },
    animationDuration: {
      description: 'Animation duration in milliseconds',
      control: 'number',
    },
    arrowPosition: {
      description: 'Arrow position',
      control: 'select',
      options: ['sides', 'bottom'],
    },
    indicatorPosition: {
      description: 'Indicator position',
      control: 'select',
      options: ['bottom-center', 'bottom-left', 'bottom-right'],
    },
    initialSlide: {
      description: 'Initial slide index',
      control: 'number',
    },
    size: {
      description: 'Carousel size with 16:9 aspect ratio (sm: max 600px, md: max 900px, lg: max 1200px, full-width: 100%, auto: content height)',
      control: 'select',
      options: ['sm', 'md', 'lg', 'full-width', 'auto'],
    },
    onSlideChange: {
      description: 'Callback when slide changes',
      action: 'slide-changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// Sample data for stories
const imageItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '8px'
      }}>
        Slide 1
      </div>
    )
  },
  {
    id: '2',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '8px'
      }}>
        Slide 2
      </div>
    )
  },
  {
    id: '3',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '8px'
      }}>
        Slide 3
      </div>
    )
  },
  {
    id: '4',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '8px'
      }}>
        Slide 4
      </div>
    )
  },
  {
    id: '5',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '8px'
      }}>
        Slide 5
      </div>
    )
  },
];

const cardItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Product 1</h3>
        <p style={{ margin: '0 0 15px 0', flex: 1 }}>This is a great product with amazing features.</p>
        <Button>
          Learn More
        </Button>
      </div>
    )
  },
  {
    id: '2',
    content: (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Product 2</h3>
        <p style={{ margin: '0 0 15px 0', flex: 1 }}>Another excellent product you'll love.</p>
        <Button>
          Learn More
        </Button>
      </div>
    )
  },
  {
    id: '3',
    content: (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Product 3</h3>
        <p style={{ margin: '0 0 15px 0', flex: 1 }}>The best product in our lineup.</p>
        <Button>
          Learn More
        </Button>
      </div>
    )
  },
  {
    id: '4',
    content: (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Product 4</h3>
        <p style={{ margin: '0 0 15px 0', flex: 1 }}>A premium product with advanced features.</p>
        <Button>
          Learn More
        </Button>
      </div>
    )
  },
];

const testimonialItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>💫</div>
        <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
          "This product has completely transformed how we work. Highly recommended!"
        </p>
        <div style={{ fontWeight: 'bold' }}>Sarah Johnson</div>
        <div style={{ color: '#666' }}>CEO, Tech Corp</div>
      </div>
    )
  },
  {
    id: '2',
    content: (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
          "Amazing experience! The team is fantastic and the results exceeded our expectations."
        </p>
        <div style={{ fontWeight: 'bold' }}>Michael Chen</div>
        <div style={{ color: '#666' }}>CTO, StartupXYZ</div>
      </div>
    )
  },
  {
    id: '3',
    content: (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⭐</div>
        <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
          "Outstanding quality and service. We couldn't be happier with our choice."
        </p>
        <div style={{ fontWeight: 'bold' }}>Emma Davis</div>
        <div style={{ color: '#666' }}>Marketing Director, BigCorp</div>
      </div>
    )
  },
];

export const Default: Story = {
  args: {
    items: imageItems,
  },
};

export const WithAutoPlay: Story = {
  args: {
    items: imageItems,
    autoPlay: true,
    autoPlayInterval: 3000,
    pauseOnHover: true,
  },
};

export const MultipleItems: Story = {
  args: {
    items: cardItems,
    itemsToShow: 2,
    itemGap: 'md',
  },
};

export const ThreeItemsCarousel: Story = {
  args: {
    items: cardItems,
    itemsToShow: 3,
    itemGap: 'sm',
  },
};

export const NoArrows: Story = {
  args: {
    items: imageItems,
    showArrows: false,
  },
};

export const NoIndicators: Story = {
  args: {
    items: imageItems,
    showIndicators: false,
  },
};

export const NoInfiniteLoop: Story = {
  args: {
    items: imageItems,
    infinite: false,
  },
};

export const CustomArrows: Story = {
  args: {
    items: imageItems,
    prevArrowIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    ),
    nextArrowIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
};

export const IndicatorPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h4>Bottom Center (Default)</h4>
        <Carousel items={imageItems} indicatorPosition="bottom-center" />
      </div>
      <div>
        <h4>Bottom Left</h4>
        <Carousel items={imageItems} indicatorPosition="bottom-left" />
      </div>
      <div>
        <h4>Bottom Right</h4>
        <Carousel items={imageItems} indicatorPosition="bottom-right" />
      </div>
    </div>
  ),
};

export const DifferentGaps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h4>No Gap</h4>
        <Carousel items={cardItems} itemsToShow={2} itemGap="none" />
      </div>
      <div>
        <h4>Small Gap</h4>
        <Carousel items={cardItems} itemsToShow={2} itemGap="sm" />
      </div>
      <div>
        <h4>Large Gap</h4>
        <Carousel items={cardItems} itemsToShow={2} itemGap="lg" />
      </div>
    </div>
  ),
};

export const TestimonialCarousel: Story = {
  args: {
    items: testimonialItems,
    autoPlay: true,
    autoPlayInterval: 4000,
    showArrows: false,
  },
};

export const ProductCarousel: Story = {
  args: {
    items: cardItems,
    itemsToShow: 3,
    itemGap: 'md',
    showIndicators: false,
  },
};

export const SingleItem: Story = {
  args: {
    items: [imageItems[0]],
  },
};

export const EmptyCarousel: Story = {
  args: {
    items: [],
  },
};

export const DarkMode: Story = {
  args: {
    items: imageItems,
    autoPlay: true,
    autoPlayInterval: 3000,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const FastAnimation: Story = {
  args: {
    items: imageItems,
    animationDuration: 150,
  },
};

export const SlowAnimation: Story = {
  args: {
    items: imageItems,
    animationDuration: 800,
  },
};

export const InitialSlide: Story = {
  args: {
    items: imageItems,
    initialSlide: 2,
  },
};

export const KeyboardNavigation: Story = {
  args: {
    items: imageItems,
    showArrows: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on the carousel and use left/right arrow keys to navigate.',
      },
    },
  },
};

// Image carousel items with actual images
const imageCarouselItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop"
        alt="Mountain landscape"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  },
  {
    id: '2',
    content: (
      <img
        src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&h=675&fit=crop"
        alt="Beach sunset"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  },
  {
    id: '3',
    content: (
      <img
        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop"
        alt="Forest path"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  },
  {
    id: '4',
    content: (
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=675&fit=crop"
        alt="Desert landscape"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  },
  {
    id: '5',
    content: (
      <img
        src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=675&fit=crop"
        alt="Snow mountains"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    )
  },
];

export const SmallSize: Story = {
  args: {
    items: imageCarouselItems,
    size: 'sm',
    autoPlay: true,
    autoPlayInterval: 3000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size carousel with 16:9 aspect ratio and max-width of 600px. Scales responsively with container width while maintaining aspect ratio. Perfect for sidebar or smaller content areas.',
      },
    },
  },
};

export const MediumSize: Story = {
  args: {
    items: imageCarouselItems,
    size: 'md',
    autoPlay: true,
    autoPlayInterval: 3000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium size carousel with 16:9 aspect ratio and max-width of 900px. Scales responsively with container width while maintaining aspect ratio. Great for content sections and feature highlights.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    items: imageCarouselItems,
    size: 'lg',
    autoPlay: true,
    autoPlayInterval: 3000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size carousel with 16:9 aspect ratio and max-width of 1200px. Scales responsively with container width while maintaining aspect ratio. Ideal for hero sections and prominent showcases.',
      },
    },
  },
};

export const FullWidthSize: Story = {
  args: {
    items: imageCarouselItems,
    size: 'full-width',
    autoPlay: true,
    autoPlayInterval: 3000,
  },
  parameters: {
    docs: {
      description: {
        story: 'Full-width carousel with 16:9 aspect ratio. Takes 100% of container width with no max-width constraint while maintaining aspect ratio. Perfect for full-width hero banners.',
      },
    },
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h4>Small (sm) - max 600px width</h4>
        <Carousel items={imageCarouselItems} size="sm" />
      </div>
      <div>
        <h4>Medium (md) - max 900px width</h4>
        <Carousel items={imageCarouselItems} size="md" />
      </div>
      <div>
        <h4>Large (lg) - max 1200px width</h4>
        <Carousel items={imageCarouselItems} size="lg" />
      </div>
      <div>
        <h4>Full Width - 100% container width</h4>
        <Carousel items={imageCarouselItems} size="full-width" />
      </div>
      <div>
        <h4>Auto (default - content defines height)</h4>
        <Carousel items={imageItems} size="auto" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compare all size variants side by side. All sized variants (sm/md/lg/full-width) maintain a 16:9 aspect ratio and scale with container width. The "auto" size has no aspect ratio constraint and relies on content to define its height.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    items: imageItems,
    showArrows: true,
    showIndicators: true,
    autoPlay: false,
    autoPlayInterval: 5000,
    pauseOnHover: true,
    infinite: true,
    itemsToShow: 1,
    itemGap: 'md',
    animationDuration: 300,
    indicatorPosition: 'bottom-center',
    initialSlide: 0,
    onSlideChange: (index) => console.log(`Slide changed to: ${index}`),
  },
};