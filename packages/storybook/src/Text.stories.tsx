import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Text",
  component: Text,
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = { args: { children: "Body copy carries the reading experience." } };
export const Variants: Story = {
  render: () => (
    <Stack gap="tight">
      <Text variant="body">body — running copy</Text>
      <Text variant="label">label — control captions</Text>
      <Text variant="note">note — supporting detail</Text>
      <Text variant="meta">meta — timestamps, counts</Text>
      <Text variant="eyebrow">eyebrow — section kicker</Text>
    </Stack>
  ),
};
export const Tones: Story = {
  render: () => (
    <Stack gap="tight">
      <Text tone="primary">primary</Text>
      <Text tone="secondary">secondary</Text>
      <Text tone="muted">muted</Text>
      <Text tone="accent">accent</Text>
      <Text tone="danger">danger</Text>
      <Text tone="warning">warning</Text>
      <Text tone="success">success</Text>
    </Stack>
  ),
};
