import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, PasswordInput } from "@mond-design-system/react";

const meta = {
  title: "Atoms/PasswordInput",
  component: PasswordInput,
} satisfies Meta<typeof PasswordInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InField: Story = {
  args: { showLabel: "Show password", hideLabel: "Hide password" },
  render: () => (
    <Field label="Password" hint="At least 12 characters.">
      <PasswordInput
        autoComplete="new-password"
        showLabel="Show password"
        hideLabel="Hide password"
      />
    </Field>
  ),
};
