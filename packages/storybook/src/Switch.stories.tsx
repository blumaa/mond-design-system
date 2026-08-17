import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Switch } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  args: { label: "Notifications" },
  render: () => (
    <Stack gap="tight">
      <Switch label="Notifications" defaultChecked />
      <Switch label="Disabled" disabled />
    </Stack>
  ),
};
