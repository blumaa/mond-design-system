import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "../Button/Button";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";
import { Badge } from "../Badge/Badge";
import { Box } from "../Box/Box";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Quick Start
\`\`\`tsx
import { Card, CardHeader, CardBody, CardFooter } from '@mond-design-system/theme';
import { Heading } from '@mond-design-system/theme';
import { Text } from '@mond-design-system/theme';
import { Button } from '@mond-design-system/theme';

function MyComponent() {
  return (
    <Card maxWidth="md">
      <CardHeader>
        <Heading level={3}>Card Title</Heading>
      </CardHeader>
      <CardBody>
        <Text>Card content goes here.</Text>
      </CardBody>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  );
}
\`\`\`

A flexible container component for structured content. Compose with CardHeader, CardBody, and CardFooter for organized layouts, or use Card alone for simple containers.

**Key Features:**
- 🎨 Three variants (default, subtle, elevated)
- 📦 Composable sub-components (Header, Body, Footer)
- 📏 Width control (maxWidth, fullWidth props)
- 🔗 Built-in link and click handling
- ♿ Semantic HTML support (article, section)
- 🎯 Automatic hover states for interactive cards
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "subtle", "elevated"],
      description: "Visual style variant",
    },
    href: {
      control: "text",
      description: "Link URL - makes entire card clickable",
    },
    target: {
      control: "text",
      description: "Link target attribute",
    },
    hoverable: {
      control: "boolean",
      description: "Show hover effect",
    },
    as: {
      control: "radio",
      options: ["div", "article", "section"],
      description: "HTML element to render as",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple card with just children
 */
export const Simple: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="md">
      <Text>Simple card with custom content. No structure required.</Text>
    </Card>
  ),
};

/**
 * Card with Header, Body, and Footer structure
 */
export const Structured: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="md">
      <CardHeader>
        <Heading level={3} size="lg">
          Card Title
        </Heading>
        <Text variant="body-sm" semantic="secondary">
          Subtitle or description
        </Text>
      </CardHeader>
      <CardBody>
        <Text>
          This is the main content area of the card. Use CardBody for your
          primary content.
        </Text>
      </CardBody>
      <CardFooter>
        <Box display="flex" gap="xs">
          <Button variant="primary">Primary Action</Button>
          <Button variant="outline">Secondary</Button>
        </Box>
      </CardFooter>
    </Card>
  ),
};

/**
 * Card with just header and body
 */
export const HeaderAndBody: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="md">
      <CardHeader>
        <Heading level={3} size="lg">
          Blog Post Title
        </Heading>
        <Text variant="body-sm" semantic="tertiary">
          January 15, 2025 • 5 min read
        </Text>
      </CardHeader>
      <CardBody>
        <Text>
          This card demonstrates header and body without a footer. Great for
          blog post previews, article cards, or informational content.
        </Text>
      </CardBody>
    </Card>
  ),
};

/**
 * Card variants - default, subtle, elevated
 */
export const Variants: Story = {
  args: { children: "" },
  render: () => (
    <Box display="flex" gap="lg" flexWrap="wrap">
      <Card variant="default" maxWidth="sm">
        <CardHeader>
          <Heading level={4} size="md">
            Default
          </Heading>
        </CardHeader>
        <CardBody>
          <Text variant="body-sm">Default background with border.</Text>
        </CardBody>
      </Card>

      <Card variant="subtle" maxWidth="sm">
        <CardHeader>
          <Heading level={4} size="md">
            Subtle
          </Heading>
        </CardHeader>
        <CardBody>
          <Text variant="body-sm">Subtle elevated background.</Text>
        </CardBody>
      </Card>

      <Card variant="elevated" maxWidth="sm">
        <CardHeader>
          <Heading level={4} size="md">
            Elevated
          </Heading>
        </CardHeader>
        <CardBody>
          <Text variant="body-sm">Elevated with shadow, no border.</Text>
        </CardBody>
      </Card>
    </Box>
  ),
};

/**
 * Clickable card with href
 */
export const Clickable: Story = {
  args: { children: "" },
  render: () => (
    <Card href="#" target="_blank" maxWidth="md">
      <CardHeader>
        <Heading level={3} size="lg">
          Clickable Card
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>
          This entire card is clickable. Hover to see the effect. Opens in new
          tab.
        </Text>
      </CardBody>
    </Card>
  ),
};

/**
 * Card with onClick handler
 */
export const WithOnClick: Story = {
  args: { children: "" },
  render: () => (
    <Card onClick={() => alert("Card clicked!")} maxWidth="md">
      <CardHeader>
        <Heading level={3} size="lg">
          Interactive Card
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>Click this card to trigger an action.</Text>
      </CardBody>
    </Card>
  ),
};

/**
 * Card rendered as semantic HTML elements
 */
export const SemanticHTML: Story = {
  args: { children: "" },
  render: () => (
    <Box display="flex" gap="lg" flexDirection="column">
      <Card as="article" maxWidth="md">
        <CardHeader>
          <Heading level={3} size="md">
            Article Card
          </Heading>
          <Text variant="body-sm" semantic="tertiary">
            Rendered as &lt;article&gt;
          </Text>
        </CardHeader>
        <CardBody>
          <Text>
            Use the &quot;as&quot; prop to render as semantic HTML elements.
          </Text>
        </CardBody>
      </Card>

      <Card as="section" maxWidth="md">
        <CardHeader>
          <Heading level={3} size="md">
            Section Card
          </Heading>
          <Text variant="body-sm" semantic="tertiary">
            Rendered as &lt;section&gt;
          </Text>
        </CardHeader>
        <CardBody>
          <Text>Better for SEO and accessibility.</Text>
        </CardBody>
      </Card>
    </Box>
  ),
};

/**
 * Product card example
 */
export const ProductCard: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="sm">
      <Box padding="4">
        <Box
          corners="rounded-md"
          marginBottom="4"
          // Placeholder for product image - would typically use an img element here
        />
      </Box>
      <CardBody>
        <Box marginBottom="2">
          <Badge variant="success" size="sm">
            In Stock
          </Badge>
        </Box>
        <Box marginBottom="2">
          <Heading level={4} size="md">
            Product Name
          </Heading>
        </Box>
        <Box marginBottom="3">
          <Text variant="body" semantic="secondary">
            Short product description goes here to entice the customer.
          </Text>
        </Box>
        <Text variant="body" weight="bold">
          $99.99
        </Text>
      </CardBody>
      <CardFooter>
        <Button variant="primary" fullWidth>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * User profile card
 */
export const UserProfile: Story = {
  args: { children: "" },
  render: () => (
    <Card variant="elevated" maxWidth="sm">
      <Box
        padding="6"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          corners="rounded-full"
          marginBottom="3"
          // Avatar placeholder - would typically use an img or Avatar component here
        />
        <Box marginBottom="1">
          <Heading level={4} size="md">
            Jane Doe
          </Heading>
        </Box>
        <Box marginBottom="4">
          <Text variant="body-sm" semantic="secondary">
            Product Designer
          </Text>
        </Box>
        <Box marginBottom="4">
          <Text variant="body-sm" align="center">
            Building beautiful and accessible user interfaces with a focus on
            design systems.
          </Text>
        </Box>
      </Box>
      <CardFooter>
        <Box display="flex" gap="xs" flex="1">
          <Box flex="1">
            <Button variant="primary" fullWidth>
              Follow
            </Button>
          </Box>
          <Box flex="1">
            <Button variant="outline" fullWidth>
              Message
            </Button>
          </Box>
        </Box>
      </CardFooter>
    </Card>
  ),
};

/**
 * Stats card
 */
export const StatsCard: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="sm">
      <CardBody>
        <Box marginBottom="2">
          <Text variant="body-sm" semantic="secondary">
            Total Revenue
          </Text>
        </Box>
        <Box marginBottom="1">
          <Heading level={2} size="3xl">
            $45,231
          </Heading>
        </Box>
        <Text variant="body-sm" semantic="success">
          +20.1% from last month
        </Text>
      </CardBody>
    </Card>
  ),
};

/**
 * Notification card
 */
export const Notification: Story = {
  args: { children: "" },
  render: () => (
    <Card maxWidth="md">
      <CardBody>
        <Box display="flex" gap="sm">
          <Box corners="rounded-md">{/* Icon or avatar placeholder */}</Box>
          <Box flex="1">
            <Box marginBottom="1">
              <Heading level={4} size="sm">
                New comment on your post
              </Heading>
            </Box>
            <Box marginBottom="2">
              <Text variant="body-sm" semantic="secondary">
                John Smith replied to your post &quot;Getting started with
                design systems&quot;
              </Text>
            </Box>
            <Text variant="body-sm" semantic="tertiary">
              2 hours ago
            </Text>
          </Box>
        </Box>
      </CardBody>
    </Card>
  ),
};

/**
 * Grid of cards
 */
export const CardGrid: Story = {
  args: { children: "" },
  render: () => (
    <Box display="grid" gap="lg">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <Card
          key={num}
          href="#"
          variant={num % 3 === 0 ? "elevated" : "default"}
        >
          <CardHeader>
            <Heading level={4} size="md">
              Card {num}
            </Heading>
          </CardHeader>
          <CardBody>
            <Text variant="body-sm">
              Example card in a responsive grid layout. Click to navigate.
            </Text>
          </CardBody>
        </Card>
      ))}
    </Box>
  ),
};

/**
 * Complex content card
 */
export const ComplexContent: Story = {
  args: { children: "" },
  render: () => (
    <Card as="article" maxWidth="lg">
      <CardHeader>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Box marginBottom="2">
              <Badge variant="primary" size="sm">
                Tutorial
              </Badge>
            </Box>
            <Box marginBottom="2">
              <Heading level={3} size="lg">
                Building Scalable Design Systems
              </Heading>
            </Box>
            <Text variant="body-sm" semantic="tertiary">
              January 15, 2025 • 12 min read
            </Text>
          </Box>
          <Badge variant="success" size="sm">
            New
          </Badge>
        </Box>
      </CardHeader>
      <CardBody>
        <Box marginBottom="4">
          <Text>
            Learn how to build and maintain a design system that scales with
            your organization. We&apos;ll cover token architecture, component
            design, documentation, and governance.
          </Text>
        </Box>
        <Box display="flex" gap="xs" flexWrap="wrap">
          <Badge variant="default" size="sm">
            Design Systems
          </Badge>
          <Badge variant="default" size="sm">
            React
          </Badge>
          <Badge variant="default" size="sm">
            TypeScript
          </Badge>
          <Badge variant="default" size="sm">
            UI/UX
          </Badge>
        </Box>
      </CardBody>
      <CardFooter>
        <Box display="flex" gap="xs" justifyContent="space-between">
          <Button variant="primary">Read Article</Button>
          <Box display="flex" gap="xs">
            <Button variant="ghost" iconOnly aria-label="Bookmark">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Button>
            <Button variant="ghost" iconOnly aria-label="Share">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </Button>
          </Box>
        </Box>
      </CardFooter>
    </Card>
  ),
};

/**
 * Minimal card - just body
 */
export const MinimalCard: Story = {
  args: { children: "" },
  render: () => (
    <Card variant="subtle" maxWidth="sm">
      <CardBody>
        <Text align="center">Minimal card with just a body section.</Text>
      </CardBody>
    </Card>
  ),
};

/**
 * Selected state - shows selected styling
 */
export const SelectedState: Story = {
  args: { children: "" },
  render: () => (
    <Box display="flex" gap="lg" flexWrap="wrap">
      <Card aspectRatio="medium" onClick={() => alert("Normal card")}>
        <CardBody>
          <Text align="center">Normal</Text>
        </CardBody>
      </Card>
      <Card
        aspectRatio="medium"
        isSelected
        onClick={() => alert("Selected card")}
      >
        <CardBody>
          <Text align="center">Selected</Text>
        </CardBody>
      </Card>
    </Box>
  ),
};

/**
 * Shake animation - triggered on click
 */
export const ShakeAnimation: Story = {
  args: { children: "" },
  render: () => {
    const [shake, setShake] = React.useState(false);

    const handleShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    };

    return (
      <Card
        aspectRatio="medium"
        shake={shake}
        onClick={handleShake}
        hoverable
      >
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
            <Text align="center" weight="bold">
              Click to Shake
            </Text>
            <Text align="center" variant="body-sm" semantic="secondary">
              Try clicking this card
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  },
};

/**
 * Jump animation - triggered on click
 */
export const JumpAnimation: Story = {
  args: { children: "" },
  render: () => {
    const [jump, setJump] = React.useState(false);

    const handleJump = () => {
      setJump(true);
      setTimeout(() => setJump(false), 800);
    };

    return (
      <Card aspectRatio="medium" jump={jump} onClick={handleJump} hoverable>
        <CardBody>
          <Box display="flex" flexDirection="column" alignItems="center" gap="sm">
            <Text align="center" weight="bold">
              Click to Jump
            </Text>
            <Text align="center" variant="body-sm" semantic="secondary">
              Try clicking this card
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  },
};

/**
 * Aspect ratio variants - square and 4:3 ratio cards
 */
export const AspectRatios: Story = {
  args: { children: "" },
  render: () => (
    <Box display="flex" gap="lg" flexWrap="wrap" alignItems="flex-start">
      <Card aspectRatio="square" variant="elevated">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="xs">
            <Text variant="body-sm" weight="bold">
              Square
            </Text>
            <Text variant="body-xs" semantic="secondary">
              1:1 ratio
            </Text>
          </Box>
        </CardBody>
      </Card>

      <Card aspectRatio="small" variant="elevated">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="xs">
            <Text variant="body-sm" weight="bold">
              Small
            </Text>
            <Text variant="body-xs" semantic="secondary">
              160px max
            </Text>
          </Box>
        </CardBody>
      </Card>

      <Card aspectRatio="medium" variant="elevated">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="xs">
            <Text variant="body-sm" weight="bold">
              Medium
            </Text>
            <Text variant="body-xs" semantic="secondary">
              240px max
            </Text>
          </Box>
        </CardBody>
      </Card>

      <Card aspectRatio="large" variant="elevated">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="xs">
            <Text variant="body-sm" weight="bold">
              Large
            </Text>
            <Text variant="body-xs" semantic="secondary">
              320px max
            </Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  ),
};

/**
 * Film tile grid - 4x4 grid of selectable cards with animations
 * Mobile-optimized design with 4:3 aspect ratio
 */
export const TileGrid: Story = {
  args: { children: "" },
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [selected, setSelected] = React.useState<number[]>([]);
    const [shaking, setShaking] = React.useState<number | null>(null);
    const [jumping, setJumping] = React.useState<number | null>(null);

    const handleCardClick = (index: number) => {
      // Toggle selection
      if (selected.includes(index)) {
        setSelected(selected.filter((i) => i !== index));
        // Trigger shake when deselecting
        setShaking(index);
        setTimeout(() => setShaking(null), 500);
      } else {
        setSelected([...selected, index]);
        // Trigger jump when selecting
        setJumping(index);
        setTimeout(() => setJumping(null), 800);
      }
    };

    return (
      <Box
        display="grid"
        gap="sm"
        gridTemplateColumns="repeat(4, 1fr)"
        responsive
      >
        {Array.from({ length: 16 }, (_, i) => (
          <Card
            key={i}
            aspectRatio="square"
            isSelected={selected.includes(i)}
            shake={shaking === i}
            jump={jumping === i}
            onClick={() => handleCardClick(i)}
            hoverable
            variant="elevated"
          >
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Text variant="body-sm" weight="medium" align="center">
                  Tile {i + 1}
                </Text>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>
    );
  },
};

/**
 * Custom backgrounds using className prop
 * Demonstrates how to apply custom styling via className
 */
export const CustomBackgrounds: Story = {
  args: { children: "" },
  parameters: {
    layout: "padded",
  },
  render: () => {
    return (
      <>
        <style>{`
          .custom-bg-blue {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .custom-bg-blue * {
            color: white;
          }
          .custom-bg-green {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .custom-bg-green * {
            color: white;
          }
          .custom-bg-orange {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
          .custom-bg-orange * {
            color: white;
          }
          .custom-bg-purple {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
          .custom-bg-purple * {
            color: white;
          }
        `}</style>
        <Box display="grid" gap="lg" gridTemplateColumns="repeat(2, 1fr)">
          <Card aspectRatio="square" className="custom-bg-blue">
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Text variant="body-sm" weight="medium" align="center">
                  Tile 1
                </Text>
              </Box>
            </CardBody>
          </Card>

          <Card aspectRatio="square" className="custom-bg-green">
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Text variant="body-sm" weight="medium" align="center">
                  Tile 2
                </Text>
              </Box>
            </CardBody>
          </Card>

          <Card aspectRatio="square" className="custom-bg-orange">
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Text variant="body-sm" weight="medium" align="center">
                  Tile 3
                </Text>
              </Box>
            </CardBody>
          </Card>

          <Card aspectRatio="square" className="custom-bg-purple">
            <CardBody>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="full"
              >
                <Text variant="body-sm" weight="medium" align="center">
                  Tile 4
                </Text>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </>
    );
  },
};
