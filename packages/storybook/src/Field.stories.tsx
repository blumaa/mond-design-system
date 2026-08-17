import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Input, Select, Textarea } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Field",
  component: Field,
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithHint: Story = {
  args: { label: "Email", hint: "Work address preferred", children: <Input placeholder="you@example.com" /> },
};
export const WithError: Story = {
  args: { label: "Email", error: "Not an email", children: <Input defaultValue="nope" /> },
};
export const Required: Story = {
  args: { label: "Name", required: true, children: <Input /> },
};
export const FormRow: Story = {
  args: { label: "unused", children: null },
  render: () => (
    <div style={{ display: "grid", gap: "1rem", width: "20rem" }}>
      <Field label="Name" required>
        <Input />
      </Field>
      <Field label="Country">
        <Select>
          <option>Denmark</option>
          <option>Germany</option>
        </Select>
      </Field>
      <Field label="Notes" hint="Optional">
        <Textarea />
      </Field>
    </div>
  ),
};
