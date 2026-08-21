import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchField } from "@mond-design-system/react";

const meta = {
  title: "Atoms/SearchField",
  component: SearchField,
} satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Search", clearLabel: "Clear search", value: "", onChange: () => {} },
  render: function Render() {
    const [value, setValue] = useState("rope");
    return (
      <SearchField
        label="Search"
        clearLabel="Clear search"
        value={value}
        onChange={setValue}
        placeholder="Search…"
      />
    );
  },
};
