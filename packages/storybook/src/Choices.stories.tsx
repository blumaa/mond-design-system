import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Radio, SegmentedControl, Switch } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Choices",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxStory: Story = {
  name: "Checkbox",
  args: { label: "Default" },
  render: () => (
    <div style={{ display: "grid" }}>
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};
export const RadioStory: Story = {
  name: "Radio",
  args: { label: "Free" },
  render: () => (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend>Plan</legend>
      <div style={{ display: "grid" }}>
        <Radio name="plan" value="free" label="Free" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
        <Radio name="plan" value="off" label="Unavailable" disabled />
      </div>
    </fieldset>
  ),
};
export const SwitchStory: Story = {
  name: "Switch",
  args: { label: "Notifications" },
  render: () => (
    <div style={{ display: "grid" }}>
      <Switch label="Notifications" defaultChecked />
      <Switch label="Disabled" disabled />
    </div>
  ),
};
export const Segmented: Story = {
  args: { label: "Range" },
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
