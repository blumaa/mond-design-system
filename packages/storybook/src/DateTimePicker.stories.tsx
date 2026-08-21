import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DateTimePicker, Field } from "@mond-design-system/react";
import story from "./story.module.css";

const english = {
  dialog: "Pick date and time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  today: "Today",
  done: "Done",
  hour: "Hour",
  minute: "Minutes",
  dayPeriod: "AM/PM",
};

const meta = {
  title: "Organisms/DateTimePicker",
  component: DateTimePicker,
} satisfies Meta<typeof DateTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InAField: Story = {
  args: { onChange: () => {}, labels: english },
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div className={story.frame}>
        <Field label="Starts">
          <DateTimePicker
            value={value}
            onChange={setValue}
            labels={english}
            minuteStep={30}
            aria-label="Starts"
          />
        </Field>
      </div>
    );
  },
};

export const German24Hour: Story = {
  args: { onChange: () => {}, labels: english },
  render: function Render() {
    const [value, setValue] = useState<string | undefined>();
    return (
      <div className={story.frame}>
        <Field label="Beginn">
          <DateTimePicker
            value={value}
            onChange={setValue}
            locale="de-DE"
            aria-label="Beginn"
            placeholder="Datum & Uhrzeit wählen"
            labels={{
              dialog: "Datum und Uhrzeit wählen",
              previousMonth: "Voriger Monat",
              nextMonth: "Nächster Monat",
              today: "Heute",
              done: "Fertig",
              hour: "Stunde",
              minute: "Minuten",
              dayPeriod: "Tageszeit",
            }}
          />
        </Field>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { onChange: () => {}, labels: english, disabled: true },
};
