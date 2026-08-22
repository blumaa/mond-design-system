import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Inline,
  Stack,
  Text,
} from "@mond-design-system/react";

const meta = {
  title: "Organisms/Card",
  component: Card,
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  args: { children: null },
  render: () => (
    <Card>
      <CardHeader>
        <Inline justify="between">
          Session report
          <Badge tone="success">Complete</Badge>
        </Inline>
      </CardHeader>
      <CardBody>
        <Text>Sections compose; the card owns nothing but the surface.</Text>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Share
        </Button>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  ),
};

export const Raised: Story = {
  args: { children: null },
  render: () => (
    <Card variant="raised">
      <CardBody>
        <Text>Raised surface, body only.</Text>
      </CardBody>
    </Card>
  ),
};

export const Interactive: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="base">
      <Card onClick={() => {}}>
        <CardBody>
          <Text>Whole card is a button.</Text>
        </CardBody>
      </Card>
      <Card href="#somewhere">
        <CardBody>
          <Text>Whole card is a link.</Text>
        </CardBody>
      </Card>
    </Stack>
  ),
};

/* The card is the section: `as` puts it in the outline, which no wrapper
   around it can do. */
export const AsSection: Story = {
  args: { children: null },
  render: () => (
    <Card as="section" aria-labelledby="card-story-rail">
      <CardHeader>
        <Heading level={2} variant="label" id="card-story-rail">
          Chapters
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>A region a screen reader can jump to, named by its own title.</Text>
      </CardBody>
    </Card>
  ),
};
