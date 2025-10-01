import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from './Grid';
import { Box } from '../Box/Box';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Grid, Box } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <div>
      {/* Simple equal-width columns */}
      <Grid columns={3} gap={16}>
        <Box p={16} bg="#e3f2fd">Item 1</Box>
        <Box p={16} bg="#e3f2fd">Item 2</Box>
        <Box p={16} bg="#e3f2fd">Item 3</Box>
        <Box p={16} bg="#e3f2fd">Item 4</Box>
        <Box p={16} bg="#e3f2fd">Item 5</Box>
        <Box p={16} bg="#e3f2fd">Item 6</Box>
      </Grid>

      {/* Custom template layout */}
      <Grid templateColumns="200px 1fr 100px" gap={20}>
        <Box p={16} bg="#ffecb3">Sidebar</Box>
        <Box p={16} bg="#c8e6c9">Main Content</Box>
        <Box p={16} bg="#ffcdd2">Actions</Box>
      </Grid>
    </div>
  );
}
\`\`\`

Grid is a CSS Grid layout component with helpful props for common patterns. Built on top of the Box component.

**Key Features:**
- 📊 CSS Grid layout with simplified API
- 🔢 Easy equal-width columns with \`columns\` prop
- 🎯 Custom grid templates with \`templateColumns\` and \`templateRows\`
- 📐 Flexible gap spacing between items
- 📱 Responsive layout patterns
- 🎭 Built on Box component for styling consistency
- 💡 Perfect for dashboards, photo grids, and complex layouts
- 🔧 Full CSS Grid power with convenient props
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of equal-width columns',
    },
    templateColumns: {
      control: { type: 'text' },
      description: 'Custom grid-template-columns CSS',
    },
    templateRows: {
      control: { type: 'text' },
      description: 'Custom grid-template-rows CSS',
    },
    gap: {
      control: { type: 'number' },
      description: 'Gap between grid items in pixels',
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const GridItem = ({ children, bg = '#e3f2fd', height }: { 
  children: React.ReactNode; 
  bg?: string;
  height?: string | number;
}) => (
  <Box 
    p={16} 
    bg={bg} 
    borderRadius={4} 
    textAlign="center" 
    fontWeight="500"
    border="1px solid #bbdefb"
    display="flex"
    alignItems="center"
    justifyContent="center"
    height={height}
  >
    {children}
  </Box>
);

export const Default: Story = {
  args: {
    columns: 3,
    gap: 16,
  },
  render: (args) => (
    <Grid {...args}>
      <GridItem>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem>Item 4</GridItem>
      <GridItem>Item 5</GridItem>
      <GridItem>Item 6</GridItem>
    </Grid>
  ),
};

export const ResponsiveColumns: Story = {
  render: () => (
    <Box>
      <Box fontSize={18} fontWeight="600" mb={16}>2 Column Grid</Box>
      <Grid columns={2} gap={16} mb={32}>
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
        <GridItem>Item 4</GridItem>
      </Grid>
      
      <Box fontSize={18} fontWeight="600" mb={16}>4 Column Grid</Box>
      <Grid columns={4} gap={12}>
        <GridItem>A</GridItem>
        <GridItem>B</GridItem>
        <GridItem>C</GridItem>
        <GridItem>D</GridItem>
        <GridItem>E</GridItem>
        <GridItem>F</GridItem>
        <GridItem>G</GridItem>
        <GridItem>H</GridItem>
      </Grid>
    </Box>
  ),
};

export const CustomTemplate: Story = {
  render: () => (
    <Box>
      <Box fontSize={18} fontWeight="600" mb={16}>Custom Template Columns</Box>
      <Grid templateColumns="200px 1fr 100px" gap={16} mb={32}>
        <GridItem bg="#ffecb3">Fixed 200px</GridItem>
        <GridItem bg="#c8e6c9">Flexible 1fr</GridItem>
        <GridItem bg="#ffcdd2">Fixed 100px</GridItem>
      </Grid>
      
      <Box fontSize={18} fontWeight="600" mb={16}>Sidebar Layout</Box>
      <Grid templateColumns="250px 1fr" gap={20} height={300}>
        <Box bg="#e1bee7" height="100%">Sidebar</Box>
        <Box bg="#f3e5f5" height="100%">Main Content</Box>
      </Grid>
    </Box>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <Box>
      <Box fontSize={20} fontWeight="bold" mb={20}>Dashboard Layout</Box>
      <Grid 
        templateColumns="repeat(4, 1fr)" 
        templateRows="80px 200px 200px 100px"
        gap={16}
        height="600px"
      >
        {/* Header */}
        <Box 
          style={{ gridColumn: '1 / -1' }}
          bg="#1976d2" 
          color="white" 
          p={16} 
          borderRadius={8}
          display="flex"
          alignItems="center"
          fontSize={18}
          fontWeight="600"
        >
          Dashboard Header
        </Box>
        
        {/* Main Content */}
        <Box 
          style={{ gridColumn: 'span 3' }}
          bg="#e3f2fd" 
          p={16} 
          borderRadius={8}
          border="1px solid #bbdefb"
        >
          <Box fontWeight="600" mb={8}>Main Content Area</Box>
          <Box color="#666">Large content section spanning 3 columns</Box>
        </Box>
        
        {/* Sidebar */}
        <GridItem bg="#fff3e0" height="100%">
          <Box>
            <Box fontWeight="600">Sidebar</Box>
            <Box fontSize={14} color="#666">Side content</Box>
          </Box>
        </GridItem>
        
        {/* Stats Cards */}
        <GridItem bg="#e8f5e8">
          <Box>
            <Box fontSize={24} fontWeight="bold">1,234</Box>
            <Box fontSize={12}>Users</Box>
          </Box>
        </GridItem>
        <GridItem bg="#fff1f1">
          <Box>
            <Box fontSize={24} fontWeight="bold">5,678</Box>
            <Box fontSize={12}>Orders</Box>
          </Box>
        </GridItem>
        <GridItem bg="#f3e5f5">
          <Box>
            <Box fontSize={24} fontWeight="bold">$12.3k</Box>
            <Box fontSize={12}>Revenue</Box>
          </Box>
        </GridItem>
        <GridItem bg="#e0f2f1">
          <Box>
            <Box fontSize={24} fontWeight="bold">98.5%</Box>
            <Box fontSize={12}>Uptime</Box>
          </Box>
        </GridItem>
        
        {/* Footer */}
        <Box 
          style={{ gridColumn: '1 / -1' }}
          bg="#f5f5f5" 
          p={16} 
          borderRadius={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="#666"
        >
          Dashboard Footer
        </Box>
      </Grid>
    </Box>
  ),
};

export const PhotoGrid: Story = {
  render: () => (
    <Box>
      <Box fontSize={18} fontWeight="600" mb={16}>Photo Grid</Box>
      <Grid columns={3} gap={8}>
        {Array.from({ length: 9 }, (_, i) => (
          <Box
            key={i}
            height={120}
            bg={`hsl(${i * 40}, 60%, 85%)`}
            borderRadius={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={14}
            fontWeight="500"
            color="#333"
          >
            Photo {i + 1}
          </Box>
        ))}
      </Grid>
    </Box>
  ),
};