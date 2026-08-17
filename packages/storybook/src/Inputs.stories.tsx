import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, SearchField, Select, Textarea } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Inputs",
  component: Input,
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", width: "18rem" }}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  ),
};
export const Disabled: Story = {
  args: { "aria-label": "Disabled", disabled: true, defaultValue: "Locked" },
};
export const TextareaStory: Story = {
  name: "Textarea",
  render: () => <Textarea aria-label="Notes" placeholder="Notes…" style={{ width: "18rem" }} />,
};
export const SelectStory: Story = {
  name: "Select",
  render: () => (
    <Select aria-label="Fruit" style={{ width: "18rem" }}>
      <option>Apple</option>
      <option>Banana</option>
    </Select>
  ),
};
export const Search: Story = {
  render: function Render() {
    const [value, setValue] = useState("rope");
    return (
      <div style={{ width: "18rem" }}>
        <SearchField label="Search" value={value} onChange={setValue} placeholder="Search…" />
      </div>
    );
  },
};
