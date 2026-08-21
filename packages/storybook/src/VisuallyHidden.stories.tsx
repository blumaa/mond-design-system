import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text, VisuallyHidden } from "@mond-design-system/react";

const meta = {
  title: "Atoms/VisuallyHidden",
  component: VisuallyHidden,
} satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

/* Nothing to look at is the point, so each story shows what is around it and
   says what a screen reader hears. */
export const Heading: Story = {
  render: () => (
    <Stack>
      <VisuallyHidden as="h1">Discover</VisuallyHidden>
      <Text>The screen above this line has no visible title, and still has an h1.</Text>
    </Stack>
  ),
};

export const Announcement: Story = {
  render: () => (
    <Stack>
      <VisuallyHidden role="status" aria-live="polite">
        Post saved
      </VisuallyHidden>
      <Text>A live region reads the change out; the page does not move.</Text>
    </Stack>
  ),
};

export const BesideAnIcon: Story = {
  render: () => (
    <Text>
      3<VisuallyHidden> unread notifications</VisuallyHidden>
    </Text>
  ),
};
