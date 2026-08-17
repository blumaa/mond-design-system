import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, Stack } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Radio",
  component: Radio,
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  args: { label: "Free" },
  render: () => (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend>Plan</legend>
      <Stack gap="tight">
        <Radio name="plan" value="free" label="Free" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
        <Radio name="plan" value="off" label="Unavailable" disabled />
      </Stack>
    </fieldset>
  ),
};
