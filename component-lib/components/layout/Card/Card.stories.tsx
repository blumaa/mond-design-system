import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Stack } from '../Stack/Stack';
import { Box } from '../Box/Box';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Card is a flexible content container with optional header, body, and footer sections. Built on top of the Box component with consistent styling.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['flat', 'outlined', 'elevated'],
      description: 'Visual style variant of the card',
    },
    padding: {
      control: { type: 'number' },
      description: 'Internal padding in pixels',
    },
    isDarkMode: {
      control: { type: 'boolean' },
      description: 'Enable dark mode styling',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    padding: 24,
  },
  render: (args) => (
    <Card {...args} maxWidth={400}>
      <Box fontSize={18} fontWeight="600" mb={8}>Card Title</Box>
      <Box color="#666" lineHeight="1.5">
        This is a simple card with some content. Cards are flexible containers 
        that can hold any type of content.
      </Box>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="horizontal" spacing={20} style={{ flexWrap: 'wrap' }}>
      <Card variant="flat" maxWidth={300}>
        <Box fontSize={16} fontWeight="600" mb={8}>Flat Card</Box>
        <Box color="#666">No shadow, minimal styling for subtle content containers.</Box>
      </Card>
      
      <Card variant="outlined" maxWidth={300}>
        <Box fontSize={16} fontWeight="600" mb={8}>Outlined Card</Box>
        <Box color="#666">Clean border styling for defined content areas.</Box>
      </Card>
      
      <Card variant="elevated" maxWidth={300}>
        <Box fontSize={16} fontWeight="600" mb={8}>Elevated Card</Box>
        <Box color="#666">Subtle shadow creates depth and visual hierarchy.</Box>
      </Card>
    </Stack>
  ),
};

export const WithComposition: Story = {
  render: () => (
    <Card maxWidth={450}>
      <CardHeader>
        <Box fontSize={20} fontWeight="bold">User Profile</Box>
        <Box fontSize={14} color="#666">Manage your account settings</Box>
      </CardHeader>
      
      <CardBody>
        <Stack spacing={16}>
          <Box>
            <Box fontSize={14} fontWeight="600" mb={4}>Name</Box>
            <Box color="#666">John Doe</Box>
          </Box>
          <Box>
            <Box fontSize={14} fontWeight="600" mb={4}>Email</Box>
            <Box color="#666">john.doe@example.com</Box>
          </Box>
          <Box>
            <Box fontSize={14} fontWeight="600" mb={4}>Role</Box>
            <Box color="#666">Administrator</Box>
          </Box>
        </Stack>
      </CardBody>
      
      <CardFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card maxWidth={320} variant="elevated">
      {/* Product Image */}
      <Box 
        height={200} 
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        borderRadius="8px 8px 0 0"
        mb={16}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize={14}
        fontWeight="500"
      >
        Product Image
      </Box>
      
      <CardBody p={0}>
        <Stack spacing={12}>
          <Box>
            <Box fontSize={18} fontWeight="600" mb={4}>Wireless Headphones</Box>
            <Box fontSize={14} color="#666">
              Premium noise-cancelling headphones with 30-hour battery life.
            </Box>
          </Box>
          
          <Stack direction="horizontal" justify="between" align="center">
            <Box fontSize={20} fontWeight="bold" color="#1976d2">$299</Box>
            <Box fontSize={14} color="#666" textDecoration="line-through">$399</Box>
          </Stack>
          
          <Stack direction="horizontal" spacing={4}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box key={star} color="#ffc107" fontSize={16}>★</Box>
            ))}
            <Box fontSize={14} color="#666" ml={8}>(4.8)</Box>
          </Stack>
        </Stack>
      </CardBody>
      
      <CardFooter>
        <Button variant="primary" style={{ width: '100%' }}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const DashboardCards: Story = {
  render: () => (
    <Stack spacing={24}>
      <Box fontSize={20} fontWeight="bold">Dashboard Cards</Box>
      
      {/* Metric Cards */}
      <Stack direction="horizontal" spacing={16} style={{ flexWrap: 'wrap' }}>
        {[
          { title: 'Total Users', value: '12,345', change: '+5.2%', color: '#4caf50' },
          { title: 'Revenue', value: '$45,678', change: '+12.1%', color: '#2196f3' },
          { title: 'Orders', value: '1,234', change: '-2.3%', color: '#ff5722' },
          { title: 'Conversion', value: '3.4%', change: '+0.8%', color: '#9c27b0' },
        ].map((metric) => (
          <Card key={metric.title} variant="outlined" padding={20} minWidth={200} flex="1">
            <Stack spacing={8}>
              <Box fontSize={14} color="#666">{metric.title}</Box>
              <Box fontSize={24} fontWeight="bold">{metric.value}</Box>
              <Box 
                fontSize={12} 
                color={metric.change.startsWith('+') ? '#4caf50' : '#f44336'}
                fontWeight="500"
              >
                {metric.change} from last month
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
      
      {/* Activity Card */}
      <Card>
        <CardHeader>
          <Box fontSize={18} fontWeight="600">Recent Activity</Box>
          <Box fontSize={14} color="#666">Latest updates from your team</Box>
        </CardHeader>
        
        <CardBody>
          <Stack spacing={16}>
            {[
              { user: 'Alice Johnson', action: 'completed task "Design Review"', time: '2 hours ago' },
              { user: 'Bob Smith', action: 'uploaded 3 files to project', time: '4 hours ago' },
              { user: 'Carol Wilson', action: 'left a comment on "Homepage Layout"', time: '1 day ago' },
            ].map((activity, index) => (
              <Stack key={index} direction="horizontal" spacing={12} align="start">
                <Box 
                  width={32} 
                  height={32} 
                  bg="#e3f2fd" 
                  borderRadius="50%" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                  fontSize={12}
                  fontWeight="600"
                  color="#1976d2"
                >
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </Box>
                <Stack spacing={4} flex="1">
                  <Box fontSize={14}>
                    <Box as="span" fontWeight="600">{activity.user}</Box> {activity.action}
                  </Box>
                  <Box fontSize={12} color="#666">{activity.time}</Box>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardBody>
        
        <CardFooter>
          <Button variant="ghost">View All Activity</Button>
        </CardFooter>
      </Card>
    </Stack>
  ),
};

export const InteractiveCard: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false);
    const [bookmarked, setBookmarked] = React.useState(false);
    
    return (
      <Card maxWidth={400} variant="elevated">
        <CardBody>
          <Stack spacing={16}>
            <Box>
              <Box fontSize={16} fontWeight="600" mb={8}>Interactive Card Example</Box>
              <Box color="#666" lineHeight="1.5">
                This card demonstrates interactive elements and state management. 
                Try clicking the buttons below!
              </Box>
            </Box>
            
            <Stack direction="horizontal" spacing={12} align="center">
              <Box
                p={8}
                borderRadius={4}
                cursor="pointer"
                bg={liked ? '#ffebee' : '#f5f5f5'}
                color={liked ? '#f44336' : '#666'}
                onClick={() => setLiked(!liked)}
                transition="all 150ms ease"
                fontSize={20}
              >
                {liked ? '❤️' : '🤍'}
              </Box>
              
              <Box
                p={8}
                borderRadius={4}
                cursor="pointer"
                bg={bookmarked ? '#e8f5e8' : '#f5f5f5'}
                color={bookmarked ? '#4caf50' : '#666'}
                onClick={() => setBookmarked(!bookmarked)}
                transition="all 150ms ease"
                fontSize={20}
              >
                {bookmarked ? '🔖' : '📄'}
              </Box>
              
              <Box fontSize={14} color="#666" ml={8}>
                {liked && bookmarked ? 'Loved and saved!' : 
                 liked ? 'Loved!' :
                 bookmarked ? 'Saved!' : 'Click to interact'}
              </Box>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    );
  },
};