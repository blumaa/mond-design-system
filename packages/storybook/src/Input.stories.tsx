import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Stack } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Input",
  component: Input,
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <Stack gap="tight" style={{ width: "18rem" }}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { "aria-label": "Disabled", disabled: true, defaultValue: "Locked" },
};
