import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Tag",
  component: Tag,
} satisfies Meta<typeof Tag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = { args: { children: "topic" } };
export const Accent: Story = { args: { tone: "accent", children: "featured" } };
export const Removable: Story = {
  args: { children: "filter", onRemove: () => {}, removeLabel: "Remove filter" },
};
