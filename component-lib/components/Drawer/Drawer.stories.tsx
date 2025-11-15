import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from './Drawer';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import { Box } from '../Box/Box';
import { useState } from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, Button } from '@mond-design-system/theme/client';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Drawer
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        width="md"
      >
        <DrawerHeader onClose={() => setIsOpen(false)}>
          <Heading level={3}>Drawer Title</Heading>
        </DrawerHeader>
        <DrawerBody>
          <Text>Your content here</Text>
        </DrawerBody>
        <DrawerFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
\`\`\`

A mobile-first responsive drawer component that slides in from the edge of the screen. Uses React Portal for proper rendering and z-index handling. Built with composition pattern using DrawerHeader, DrawerBody, and DrawerFooter.

**Key Features:**
- 📱 Mobile-first design with responsive behavior
- 🎯 Four positions (left, right, top, bottom)
- 📏 Multiple sizes (sm, md, lg, xl, full)
- 🎨 Composition pattern with Header, Body, Footer
- ♿ Full keyboard navigation and focus management
- 🚫 Configurable close behaviors (backdrop click, escape key)
- 🌙 Dark mode support
- 🔌 Uses React Portal for proper DOM placement
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    width: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    height: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    showBackdrop: {
      control: 'boolean',
    },
    closeOnBackdropClick: {
      control: 'boolean',
    },
    closeOnEsc: {
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
      <Box>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>

        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DrawerHeader onClose={() => setIsOpen(false)}>
            <Heading level={3}>Default Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Box marginBottom="4">
              <Text as="p">
                This is a drawer that slides in from the right (default position).
              </Text>
            </Box>
            <Text as="p">
              Click the X button, press Escape, or click the backdrop to close.
            </Text>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Save
            </Button>
          </DrawerFooter>
        </Drawer>
      </Box>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [topOpen, setTopOpen] = useState(false);
    const [bottomOpen, setBottomOpen] = useState(false);

    return (
      <Box display="flex" gap="md" flexWrap="wrap">
        <Button onClick={() => setLeftOpen(true)}>Open Left</Button>
        <Button onClick={() => setRightOpen(true)}>Open Right</Button>
        <Button onClick={() => setTopOpen(true)}>Open Top</Button>
        <Button onClick={() => setBottomOpen(true)}>Open Bottom</Button>

        <Drawer isOpen={leftOpen} onClose={() => setLeftOpen(false)} position="left">
          <DrawerHeader onClose={() => setLeftOpen(false)}>
            <Heading level={3}>Left Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>Slides in from the left side</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={rightOpen} onClose={() => setRightOpen(false)} position="right">
          <DrawerHeader onClose={() => setRightOpen(false)}>
            <Heading level={3}>Right Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>Slides in from the right side</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={topOpen} onClose={() => setTopOpen(false)} position="top">
          <DrawerHeader onClose={() => setTopOpen(false)}>
            <Heading level={3}>Top Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>Slides in from the top</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={bottomOpen} onClose={() => setBottomOpen(false)} position="bottom">
          <DrawerHeader onClose={() => setBottomOpen(false)}>
            <Heading level={3}>Bottom Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>Slides in from the bottom (great for mobile sheets)</Text>
          </DrawerBody>
        </Drawer>
      </Box>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [smOpen, setSmOpen] = useState(false);
    const [mdOpen, setMdOpen] = useState(false);
    const [lgOpen, setLgOpen] = useState(false);
    const [xlOpen, setXlOpen] = useState(false);

    return (
      <Box display="flex" gap="md" flexWrap="wrap">
        <Button onClick={() => setSmOpen(true)}>Small (320px)</Button>
        <Button onClick={() => setMdOpen(true)}>Medium (400px)</Button>
        <Button onClick={() => setLgOpen(true)}>Large (500px)</Button>
        <Button onClick={() => setXlOpen(true)}>Extra Large (640px)</Button>

        <Drawer isOpen={smOpen} onClose={() => setSmOpen(false)} width="sm">
          <DrawerHeader onClose={() => setSmOpen(false)}>
            <Heading level={3}>Small Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>320px width drawer</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={mdOpen} onClose={() => setMdOpen(false)} width="md">
          <DrawerHeader onClose={() => setMdOpen(false)}>
            <Heading level={3}>Medium Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>400px width drawer (default)</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={lgOpen} onClose={() => setLgOpen(false)} width="lg">
          <DrawerHeader onClose={() => setLgOpen(false)}>
            <Heading level={3}>Large Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>500px width drawer</Text>
          </DrawerBody>
        </Drawer>

        <Drawer isOpen={xlOpen} onClose={() => setXlOpen(false)} width="xl">
          <DrawerHeader onClose={() => setXlOpen(false)}>
            <Heading level={3}>Extra Large Drawer</Heading>
          </DrawerHeader>
          <DrawerBody>
            <Text>640px width drawer</Text>
          </DrawerBody>
        </Drawer>
      </Box>
    );
  },
};

