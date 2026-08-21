import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Spinner } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <Inline gap="loose">
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </Inline>
  ),
};
