import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Stack, Text } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Container",
  component: Container,
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Widths: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="loose">
      <Container>
        <Text>Content width — reading measure, forms, detail pages.</Text>
      </Container>
      <Container width="wide">
        <Text>Wide width — dashboards, tables, galleries.</Text>
      </Container>
    </Stack>
  ),
};

/** What the widths are for. A Container is the only primitive that centres
 * itself — margin-inline: auto against a max-width — and that is unreadable
 * until the room it centres in is visible, so the story takes the whole canvas
 * and paints the ground. The dashed line is the Container; the sunken fill
 * either side is the margin. The gutter is inside the dashed line: page-edge
 * padding the column keeps whether or not there is room to spare.
 * Below 720px there is no room to spare and neither width centres — the column
 * is the canvas. Widen the canvas to see the story. */
export const Centering: Story = {
  args: { children: null },
  parameters: { layout: "fullscreen" },
  render: () => (
    <Stack gap="loose" className={story.stage}>
      <Container className={story.bounds}>
        <Text>width="content" — the 720px reading column.</Text>
      </Container>
      <Container width="wide" className={story.bounds}>
        <Text>width="wide" — 1200px. Same centring, wider measure.</Text>
      </Container>
    </Stack>
  ),
};
