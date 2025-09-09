import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';
import { useState } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import { Heading } from '../../atoms/Heading/Heading';

const meta: Meta<typeof BottomSheet> = {
  title: 'Organisms/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from '@mond-design-system/theme';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Bottom Sheet
      </button>
      
      <BottomSheet 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <BottomSheetHeader>
          <h2>Sheet Title</h2>
        </BottomSheetHeader>
        <BottomSheetBody>
          <p>Your content here</p>
        </BottomSheetBody>
        <BottomSheetFooter>
          <button onClick={() => setIsOpen(false)}>
            Close
          </button>
        </BottomSheetFooter>
      </BottomSheet>
    </>
  );
}
\`\`\`

A mobile-friendly modal alternative that slides up from the bottom of the screen. Perfect for mobile interfaces, action sheets, and secondary content. Features drag-to-close gestures, multiple sizes, and full accessibility support.

**Key Features:**
- 📱 Mobile-first design with responsive behavior
- 👆 Drag-to-close gesture support  
- 🎨 Multiple size variants (sm, md, lg, full)
- ♿ Full keyboard navigation and accessibility
- 🌙 Dark mode support
- ⚡ Smooth animations with spring physics
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      description: 'Whether the bottom sheet is open',
      control: 'boolean',
    },
    size: {
      description: 'Size of the bottom sheet',
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    showDragHandle: {
      description: 'Whether to show drag handle',
      control: 'boolean',
    },
    enableDragToClose: {
      description: 'Whether to enable drag to close',
      control: 'boolean',
    },
    closeOnOverlayClick: {
      description: 'Whether to close on overlay click',
      control: 'boolean',
    },
    closeOnEscapeKey: {
      description: 'Whether to close on escape key',
      control: 'boolean',
    },
    isDarkMode: {
      description: 'Dark mode support',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Bottom Sheet
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          size="md"
        >
          <BottomSheetHeader>
            <Heading level={2} size="lg">
              Welcome to Bottom Sheet
            </Heading>
          </BottomSheetHeader>
          
          <BottomSheetBody>
            <Text>
              This is a bottom sheet component. You can drag the handle at the top to close it, 
              or click outside the sheet. It's perfect for mobile interfaces and secondary actions.
            </Text>
            <br />
            <Text>
              The sheet supports multiple sizes and can contain any content you need.
            </Text>
          </BottomSheetBody>
          
          <BottomSheetFooter>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </div>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [openSheets, setOpenSheets] = useState({
      sm: false,
      md: false,
      lg: false,
      full: false,
    });
    
    const openSheet = (size: 'sm' | 'md' | 'lg' | 'full') => {
      setOpenSheets(prev => ({ ...prev, [size]: true }));
    };
    
    const closeSheet = (size: 'sm' | 'md' | 'lg' | 'full') => {
      setOpenSheets(prev => ({ ...prev, [size]: false }));
    };
    
    return (
      <div style={{ padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button onClick={() => openSheet('sm')}>Small</Button>
        <Button onClick={() => openSheet('md')}>Medium</Button>
        <Button onClick={() => openSheet('lg')}>Large</Button>
        <Button onClick={() => openSheet('full')}>Full Height</Button>
        
        <BottomSheet isOpen={openSheets.sm} onClose={() => closeSheet('sm')} size="sm">
          <BottomSheetHeader>
            <Heading level={3}>Small Sheet</Heading>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Text>Perfect for quick actions and confirmations.</Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onClick={() => closeSheet('sm')}>Close</Button>
          </BottomSheetFooter>
        </BottomSheet>
        
        <BottomSheet isOpen={openSheets.md} onClose={() => closeSheet('md')} size="md">
          <BottomSheetHeader>
            <Heading level={3}>Medium Sheet</Heading>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Text>Good balance between content space and screen real estate.</Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onClick={() => closeSheet('md')}>Close</Button>
          </BottomSheetFooter>
        </BottomSheet>
        
        <BottomSheet isOpen={openSheets.lg} onClose={() => closeSheet('lg')} size="lg">
          <BottomSheetHeader>
            <Heading level={3}>Large Sheet</Heading>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Text>Ideal for forms, detailed content, and complex interactions.</Text>
            <br />
            <Text>
              You can put more content here since there's more available space. 
              This size works well for content that needs more breathing room.
            </Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onClick={() => closeSheet('lg')}>Close</Button>
          </BottomSheetFooter>
        </BottomSheet>
        
        <BottomSheet isOpen={openSheets.full} onClose={() => closeSheet('full')} size="full">
          <BottomSheetHeader>
            <Heading level={3}>Full Height Sheet</Heading>
          </BottomSheetHeader>
          <BottomSheetBody>
            <Text>Takes up most of the screen - great for full-page experiences.</Text>
            <br />
            <Text>
              Use this for complex forms, detailed views, or when you need maximum content area. 
              Still maintains the bottom sheet behavior with drag-to-close.
            </Text>
            <br />
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </BottomSheetBody>
          <BottomSheetFooter>
            <Button onClick={() => closeSheet('full')}>Close</Button>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const WithoutDragHandle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Sheet (No Handle)
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          showDragHandle={false}
          size="md"
        >
          <BottomSheetHeader>
            <Heading level={3}>No Drag Handle</Heading>
          </BottomSheetHeader>
          
          <BottomSheetBody>
            <Text>
              This sheet has no drag handle. You can still close it by clicking outside 
              or pressing the Escape key.
            </Text>
          </BottomSheetBody>
          
          <BottomSheetFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const DisabledInteractions: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Sheet (Limited Interactions)
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          enableDragToClose={false}
          closeOnOverlayClick={false}
          closeOnEscapeKey={false}
          size="md"
        >
          <BottomSheetHeader>
            <Heading level={3}>Controlled Interactions</Heading>
          </BottomSheetHeader>
          
          <BottomSheetBody>
            <Text>
              This sheet can only be closed using the button below. Drag-to-close, 
              overlay clicks, and escape key are all disabled.
            </Text>
          </BottomSheetBody>
          
          <BottomSheetFooter>
            <Button onClick={() => setIsOpen(false)}>
              Close Sheet
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '200px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Dark Sheet
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          isDarkMode
          size="md"
        >
          <BottomSheetHeader isDarkMode>
            <Heading level={3}>Dark Mode Sheet</Heading>
          </BottomSheetHeader>
          
          <BottomSheetBody>
            <Text>
              This bottom sheet is styled for dark mode with appropriate colors 
              and contrast ratios.
            </Text>
          </BottomSheetBody>
          
          <BottomSheetFooter isDarkMode>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Confirm
              </Button>
            </div>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const ActionSheet: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const actions = [
      { label: 'Share', icon: '📤' },
      { label: 'Copy Link', icon: '🔗' },
      { label: 'Download', icon: '⬇️' },
      { label: 'Edit', icon: '✏️' },
      { label: 'Delete', icon: '🗑️', danger: true },
    ];
    
    const handleAction = (action: string) => {
      alert(`${action} clicked`);
      setIsOpen(false);
    };
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Action Sheet
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          size="sm"
        >
          <BottomSheetBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action.label)}
                  style={{
                    padding: '16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '16px',
                    color: action.danger ? '#ef4444' : 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </BottomSheetBody>
          
          <BottomSheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} style={{ width: '100%' }}>
              Cancel
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};

export const FormSheet: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ padding: '20px' }}>
        <Button onClick={() => setIsOpen(true)}>
          Open Form Sheet
        </Button>
        
        <BottomSheet 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          size="lg"
          closeOnOverlayClick={false}
        >
          <BottomSheetHeader>
            <Heading level={3}>Contact Form</Heading>
            <Text variant="body-sm" style={{ opacity: 0.7, marginTop: '4px' }}>
              Fill out the form below to get in touch
            </Text>
          </BottomSheetHeader>
          
          <BottomSheetBody>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="fullname" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                  Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                  Message
                </label>
                <textarea
                  id="message"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                  placeholder="Your message here..."
                />
              </div>
            </form>
          </BottomSheetBody>
          
          <BottomSheetFooter>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                Send Message
              </Button>
            </div>
          </BottomSheetFooter>
        </BottomSheet>
      </div>
    );
  },
};