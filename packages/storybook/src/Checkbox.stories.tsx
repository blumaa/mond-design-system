import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Stack } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  args: { label: "Default" },
  render: () => (
    <Stack gap="tight">
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </Stack>
  ),
};
