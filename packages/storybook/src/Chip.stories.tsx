import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Chip, ChipBar, ChipGroup } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Chip",
  component: Chip,
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Soft: Story = { args: { children: "Padel" } };
export const Outline: Story = { args: { variant: "outline", children: "Nearby" } };
export const Selected: Story = { args: { selected: true, onClick: () => {}, children: "All" } };
export const Disabled: Story = { args: { disabled: true, onClick: () => {}, children: "Soon" } };

export const FilterBar: Story = {
  args: { children: "All" },
  render: function Render() {
    const segments = ["All", "Games", "Posts", "Players", "Courts", "Coaching"];
    const [segment, setSegment] = useState("All");
    return (
      <div className={story.frame}>
        <ChipBar bordered>
          {segments.map((s) => (
            <Chip key={s} selected={s === segment} onClick={() => setSegment(s)}>
              {s}
            </Chip>
          ))}
        </ChipBar>
      </div>
    );
  },
};

export const MultiSelectGroup: Story = {
  args: { children: "Mon" },
  render: function Render() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [picked, setPicked] = useState(new Set(["Tue", "Thu"]));
    const toggle = (day: string) =>
      setPicked((prev) => {
        const next = new Set(prev);
        if (next.has(day)) next.delete(day);
        else next.add(day);
        return next;
      });
    return (
      <div className={story.frame}>
        <ChipGroup>
          {days.map((day) => (
            <Chip key={day} variant="outline" selected={picked.has(day)} onClick={() => toggle(day)}>
              {day}
            </Chip>
          ))}
        </ChipGroup>
      </div>
    );
  },
};
