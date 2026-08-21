import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inline, Spinner } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Loading" } };
export const Sizes: Story = {
  args: { label: "Loading" },
  render: () => (
    <Inline gap="loose">
      <Spinner label="Loading" size={16} />
      <Spinner label="Loading" size={24} />
      <Spinner label="Loading" size={40} />
    </Inline>
  ),
};
