import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Select",
  component: Select,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Fruit", children: null },
  render: () => (
    <Select aria-label="Fruit">
      <option>Apple</option>
      <option>Banana</option>
    </Select>
  ),
};
