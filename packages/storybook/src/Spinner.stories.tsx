import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </div>
  ),
};
