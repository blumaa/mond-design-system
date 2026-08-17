import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Badge>12</Badge>
      <Badge tone="accent">new</Badge>
      <Badge tone="danger">3</Badge>
      <Badge tone="warning">due</Badge>
      <Badge tone="success">done</Badge>
    </div>
  ),
};
