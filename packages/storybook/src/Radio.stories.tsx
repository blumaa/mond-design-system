import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, Stack } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Radio",
  component: Radio,
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled, with a per-render group name: the docs page renders a story
 * more than once, and duplicated uncontrolled name="…" groups would fight
 * each other across copies. */
export const Group: Story = {
  args: { label: "Free" },
  render: function Render() {
    const name = useId();
    const [plan, setPlan] = useState("free");
    return (
      <fieldset className={story.fieldset}>
        <legend>Plan</legend>
        <Stack gap="tight">
          {([["free", "Free"], ["pro", "Pro"], ["team", "Team"]] as const).map(([value, label]) => (
            <Radio
              key={value}
              name={name}
              value={value}
              label={label}
              checked={plan === value}
              onChange={() => setPlan(value)}
            />
          ))}
        </Stack>
      </fieldset>
    );
  },
};

export const Sizes: Story = {
  args: { label: "Medium" },
  render: function Render() {
    const name = useId();
    return (
      <Stack gap="tight">
        <Radio name={`${name}-sm`} size="sm" label="Small" checked onChange={() => {}} />
        <Radio name={`${name}-md`} label="Medium" checked onChange={() => {}} />
        <Radio name={`${name}-lg`} size="lg" label="Large" checked onChange={() => {}} />
      </Stack>
    );
  },
};

export const States: Story = {
  args: { label: "Selected" },
  render: function Render() {
    const name = useId();
    return (
      <Stack gap="tight">
        <Radio name={`${name}-a`} label="Selected" checked onChange={() => {}} />
        <Radio name={`${name}-b`} label="Unselected" checked={false} onChange={() => {}} />
        <Radio name={`${name}-c`} label="Disabled" disabled />
        <Radio name={`${name}-d`} label="Disabled selected" disabled checked onChange={() => {}} />
      </Stack>
    );
  },
};
