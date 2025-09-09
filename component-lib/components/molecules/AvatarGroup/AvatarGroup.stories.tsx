import type { Meta, StoryObj } from '@storybook/react';
import { AvatarGroup, AvatarData } from './AvatarGroup';
// Actions simplified for Storybook 9.x compatibility

const meta: Meta<typeof AvatarGroup> = {
  title: 'Molecules/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { AvatarGroup } from '@mond-design-system/theme';

function MyComponent() {
  const avatars = [
    { id: '1', src: '/avatar1.jpg', alt: 'John Doe', fallback: 'JD' },
    { id: '2', src: '/avatar2.jpg', alt: 'Jane Smith', fallback: 'JS' },
    { id: '3', src: '/avatar3.jpg', alt: 'Mike Johnson', fallback: 'MJ' },
    { id: '4', src: '/avatar4.jpg', alt: 'Sarah Wilson', fallback: 'SW' },
    { id: '5', src: '/avatar5.jpg', alt: 'Tom Brown', fallback: 'TB' },
  ];
  
  return (
    <AvatarGroup
      avatars={avatars}
      maxCount={3}
      onAvatarClick={(avatar) => console.log('Clicked:', avatar.alt)}
      onExcessClick={(hiddenAvatars) => console.log('Show more:', hiddenAvatars)}
    />
  );
}
\`\`\`

AvatarGroup is a molecule component that displays multiple Avatar atoms in an overlapping layout. It provides overflow management with a "+N more" indicator when the number of avatars exceeds the maximum display count.

**Key Features:**
- 🔗 Overlapping Layout with customizable spacing
- 📊 Overflow Management with "+N more" indicator
- 🖱️ Interactive avatars with click handlers
- 📏 Flexible sizing for all avatars in the group
- 🎨 Custom excess rendering capabilities
- ✨ Hover effects for interactive elements
- ♿ Full ARIA support and keyboard navigation
- ⚡ Performance optimized rendering
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size for all avatars in the group',
    },
    maxCount: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Maximum avatars to display before showing "+N more"',
    },
    spacing: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Overlap amount between avatars',
    },
    isDarkMode: {
      control: { type: 'boolean' },
      description: 'Enable dark mode styling',
    },
    onAvatarClick: { action: 'avatar-clicked' },
    onExcessClick: { action: 'excess-clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

// Sample avatar data
const sampleAvatars: AvatarData[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', alt: 'John Doe', fallback: 'JD' },
  { id: '2', src: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b1?w=150&h=150&fit=crop&crop=face', alt: 'Jane Smith', fallback: 'JS' },
  { id: '3', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', alt: 'Mike Johnson', fallback: 'MJ' },
  { id: '4', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face', alt: 'Sarah Wilson', fallback: 'SW' },
  { id: '5', src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face', alt: 'Tom Brown', fallback: 'TB' },
  { id: '6', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face', alt: 'Emma Davis', fallback: 'ED' },
  { id: '7', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', alt: 'Lisa Anderson', fallback: 'LA' },
  { id: '8', fallback: 'RT', alt: 'Robert Taylor' },
  { id: '9', fallback: 'MG', alt: 'Maria Garcia' },
  { id: '10', fallback: 'DL', alt: 'David Lee' },
];

const fallbackAvatars: AvatarData[] = [
  { id: '1', fallback: 'AB', alt: 'Alice Brown' },
  { id: '2', fallback: 'CD', alt: 'Charlie Davis' },
  { id: '3', fallback: 'EF', alt: 'Eva Foster' },
  { id: '4', fallback: 'GH', alt: 'George Harris' },
  { id: '5', fallback: 'IJ', alt: 'Ivy Jackson' },
];

// Basic Examples
export const Default: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 4),
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
};

export const WithFallbacks: Story = {
  args: {
    avatars: fallbackAvatars,
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'AvatarGroup works with avatars that use fallback text (initials) instead of images.',
      },
    },
  },
};

// Size Variants
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Extra Small (xs)</h4>
        <AvatarGroup {...args} size="xs" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Small (sm)</h4>
        <AvatarGroup {...args} size="sm" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Medium (md) - Default</h4>
        <AvatarGroup {...args} size="md" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Large (lg)</h4>
        <AvatarGroup {...args} size="lg" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Extra Large (xl)</h4>
        <AvatarGroup {...args} size="xl" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>2X Large (2xl)</h4>
        <AvatarGroup {...args} size="2xl" />
      </div>
    </div>
  ),
  args: {
    avatars: sampleAvatars.slice(0, 5),
    maxCount: 3,
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'AvatarGroup supports all Avatar size variants from xs to 2xl.',
      },
    },
  },
};

// Max Count Variants
export const MaxCountVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Max Count: 2</h4>
        <AvatarGroup {...args} maxCount={2} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Max Count: 3</h4>
        <AvatarGroup {...args} maxCount={3} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Max Count: 5 (Default)</h4>
        <AvatarGroup {...args} maxCount={5} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Max Count: 8</h4>
        <AvatarGroup {...args} maxCount={8} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>All Avatars (No Excess)</h4>
        <AvatarGroup {...args} maxCount={10} />
      </div>
    </div>
  ),
  args: {
    avatars: sampleAvatars,
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Control how many avatars are shown before displaying the "+N more" indicator.',
      },
    },
  },
};

// Spacing Variants
export const SpacingVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Small Spacing (More Overlap)</h4>
        <AvatarGroup {...args} spacing="sm" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Medium Spacing (Default)</h4>
        <AvatarGroup {...args} spacing="md" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Large Spacing (Less Overlap)</h4>
        <AvatarGroup {...args} spacing="lg" />
      </div>
    </div>
  ),
  args: {
    avatars: sampleAvatars.slice(0, 6),
    maxCount: 4,
    size: 'lg',
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Control the overlap amount between avatars with spacing variants.',
      },
    },
  },
};

// Interactive Examples
export const Interactive: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 7),
    maxCount: 4,
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on any avatar or the "+3 more" indicator to see the interaction callbacks. Avatars have hover effects when interactive.',
      },
    },
  },
};

export const NonInteractive: Story = {
  args: {
    avatars: sampleAvatars.slice(0, 7),
    maxCount: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'AvatarGroup without click handlers - avatars are not interactive and have no hover effects.',
      },
    },
  },
};

// Custom Excess Rendering
export const CustomExcess: Story = {
  args: {
    avatars: sampleAvatars,
    maxCount: 3,
    renderExcess: (count, size, isDarkMode) => (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'lg' ? '48px' : size === 'xl' ? '64px' : size === '2xl' ? '80px' : '40px',
          height: size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'lg' ? '48px' : size === 'xl' ? '64px' : size === '2xl' ? '80px' : '40px',
          borderRadius: '50%',
          backgroundColor: isDarkMode ? '#3B82F6' : '#2563EB',
          color: 'white',
          fontSize: size === 'xs' ? '10px' : size === 'sm' ? '12px' : size === 'lg' ? '16px' : size === 'xl' ? '18px' : size === '2xl' ? '20px' : '14px',
          fontWeight: 'bold',
          border: `2px solid ${isDarkMode ? '#1F2937' : '#FFFFFF'}`,
          cursor: 'pointer',
        }}
      >
        +{count}
      </div>
    ),
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize the "+N more" indicator with a custom render function. This example shows a blue styled excess indicator.',
      },
    },
  },
};

// Team Examples
export const TeamMembersExample: Story = {
  render: (_args) => {
    const teamMembers: AvatarData[] = [
      { id: 'pm', fallback: 'PM', alt: 'Product Manager' },
      { id: 'dev1', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', alt: 'Lead Developer', fallback: 'LD' },
      { id: 'dev2', src: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b1?w=150&h=150&fit=crop&crop=face', alt: 'Frontend Developer', fallback: 'FD' },
      { id: 'designer', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', alt: 'UI Designer', fallback: 'UD' },
      { id: 'qa', fallback: 'QA', alt: 'QA Engineer' },
    ];

    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#374151' }}>Project Team</h3>
        <AvatarGroup
          avatars={teamMembers}
          maxCount={4}
          size="md"
          onAvatarClick={(avatar) => alert(`View profile: ${avatar.alt}`)}
          onExcessClick={(hiddenAvatars) => alert(`Show ${hiddenAvatars.length} more team members`)}
        />
        <p style={{ marginTop: '12px', marginBottom: 0, color: '#6B7280', fontSize: '14px' }}>
          Click on avatars to view team member profiles
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example showing a project team with mixed avatar types (images and fallbacks).',
      },
    },
  },
};

export const NotificationUsersExample: Story = {
  render: (_args) => (
    <div style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AvatarGroup
          avatars={sampleAvatars.slice(0, 8)}
          maxCount={3}
          size="sm"
          spacing="sm"
        />
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>
            New likes on your post
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>
            John, Jane, Mike and 5 others liked your photo
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of AvatarGroup in a notification context, showing users who performed an action.',
      },
    },
  },
};

// Dark Mode
export const DarkMode: Story = {
  render: (args) => (
    <div style={{ 
      backgroundColor: '#1F2937', 
      padding: '32px', 
      borderRadius: '12px' 
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'white', marginTop: 0, marginBottom: '16px' }}>Team Avatars (Dark Mode)</h3>
        <AvatarGroup {...args} isDarkMode />
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: 'white', marginTop: 0, marginBottom: '12px' }}>Different Sizes</h4>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <AvatarGroup {...args} size="sm" maxCount={3} isDarkMode />
          <AvatarGroup {...args} size="md" maxCount={3} isDarkMode />
          <AvatarGroup {...args} size="lg" maxCount={3} isDarkMode />
        </div>
      </div>
      
      <div>
        <h4 style={{ color: 'white', marginTop: 0, marginBottom: '12px' }}>With Custom Excess</h4>
        <AvatarGroup
          {...args}
          isDarkMode
          renderExcess={(count) => (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#7C3AED',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '2px solid #1F2937',
              }}
            >
              +{count}
            </div>
          )}
        />
      </div>
    </div>
  ),
  args: {
    avatars: sampleAvatars,
    maxCount: 4,
    onAvatarClick: () => {},
    onExcessClick: () => {},
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: 'AvatarGroup in dark mode with various configurations.',
      },
    },
  },
};

// Edge Cases
export const EdgeCases: Story = {
  render: (_args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Single Avatar</h4>
        <AvatarGroup avatars={sampleAvatars.slice(0, 1)} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Two Avatars</h4>
        <AvatarGroup avatars={sampleAvatars.slice(0, 2)} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Max Count 0 (All Hidden)</h4>
        <AvatarGroup avatars={sampleAvatars.slice(0, 5)} maxCount={0} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Empty Avatar Array</h4>
        <AvatarGroup avatars={[]} />
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
          (Nothing renders when avatars array is empty)
        </p>
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0' }}>Large Count with Small Max</h4>
        <AvatarGroup avatars={sampleAvatars.slice(0, 20).concat(Array.from({ length: 30 }, (_, i) => ({ id: `extra-${i}`, fallback: `E${i}` })))} maxCount={2} />
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6B7280' }}>
          (Showing +48 more from 50 total avatars)
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Edge cases and unusual configurations to demonstrate component robustness.',
      },
    },
  },
};