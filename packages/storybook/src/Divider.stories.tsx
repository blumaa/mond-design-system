import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, Inline, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Stack>
      <Text>Above</Text>
      <Divider />
      <Text>Below</Text>
    </Stack>
  ),
};
export const Vertical: Story = {
  render: () => (
    <Inline>
      <Text>Left</Text>
      <Divider orientation="vertical" />
      <Text>Right</Text>
    </Inline>
  ),
};
