import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Icon",
  component: Icon,
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = { args: { name: "star" } };
export const Labelled: Story = { args: { name: "search", label: "Search" } };
export const Sizes: Story = {
  args: { name: "check" },
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Icon name="check" size="sm" />
      <Icon name="check" size="md" />
      <Icon name="check" size="lg" />
    </div>
  ),
};
