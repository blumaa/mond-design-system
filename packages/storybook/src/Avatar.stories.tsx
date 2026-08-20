import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = { args: { name: "Ada Lovelace" } };
export const Sizes: Story = {
  args: { name: "Ada Lovelace" },
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Grace Hopper" size="md" />
      <Avatar name="Alan Turing" size="lg" />
    </div>
  ),
};
