import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl, Stack } from "@mond-design-system/react";

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

/** Chrome, not a field: `bare` drops the tray and `size="sm"` takes the
    smaller step, for a switch that shares a header bar with taller things. */
export const Chrome: Story = {
  args: { label: "Language", value: "en", onChange: () => {}, options: [] },
  render: function Render() {
    const [lang, setLang] = useState("en");
    const options = [
      { value: "en", label: "EN" },
      { value: "de", label: "DE" },
    ];
    return (
      <Stack>
        <SegmentedControl label="Language" size="sm" value={lang} onChange={setLang} options={options} />
        <SegmentedControl label="Language" size="sm" bare value={lang} onChange={setLang} options={options} />
      </Stack>
    );
  },
};
