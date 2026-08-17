import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "@mond-design-system/react";

const meta = {
  title: "Atoms/SegmentedControl",
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Range", value: "week", onChange: () => {}, options: [] },
  render: function Render() {
    const [range, setRange] = useState("week");
    return (
      <SegmentedControl
        label="Range"
        value={range}
        onChange={setRange}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
    );
  },
};
