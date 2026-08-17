import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, Text } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Text>Above</Text>
      <Divider />
      <Text>Below</Text>
    </div>
  ),
};
export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Text>Left</Text>
      <Divider orientation="vertical" />
      <Text>Right</Text>
    </div>
  ),
};
