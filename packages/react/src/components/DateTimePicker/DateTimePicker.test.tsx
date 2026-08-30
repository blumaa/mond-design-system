// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Field } from "../Field/Field";
import { DateTimePicker } from "./DateTimePicker";

/* Fixed future dates so `min: now` never interferes. */
const MIN = new Date(2030, 5, 15, 12, 0, 0).toISOString(); // Jun 15 2030
const VALUE = new Date(2030, 5, 20, 14, 30, 0).toISOString(); // Jun 20 2030, 14:30

const LABELS = {
  dialog: "Pick date and time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  today: "Today",
  done: "Done",
  hour: "Hour",
  minute: "Minutes",
  dayPeriod: "AM/PM",
};

function setup(props: Partial<Parameters<typeof DateTimePicker>[0]> = {}) {
  const onChange = vi.fn();
  render(
    <DateTimePicker
      value={VALUE}
      onChange={onChange}
      labels={LABELS}
      min={MIN}
      aria-label="Starts"
      locale="en-US"
      {...props}
    />,
  );
  return { onChange };
}

describe("DateTimePicker", () => {
  it("inside a Field, the trigger takes the field's id and describedby", () => {
    render(
      <Field label="Starts" hint="Local time">
        <DateTimePicker onChange={vi.fn()} labels={LABELS} locale="en-US" />
      </Field>,
    );
    const trigger = screen.getByRole("button");
    // The Field's <label htmlFor> points at its generated control id; the
    // trigger has to claim that id or the label names nothing.
    expect(screen.getByText("Starts")).toHaveAttribute("for", trigger.id);
    expect(trigger.id).not.toBe("");
    expect(trigger).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Local time").id,
    );
  });

  it("carries the Field's invalid flag, like every other control", () => {
    render(
      <Field label="Starts" error="Pick a time">
        <DateTimePicker onChange={vi.fn()} labels={LABELS} locale="en-US" />
      </Field>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("an explicit id wins over the Field's", () => {
    render(
      <Field label="Starts">
        <DateTimePicker id="mine" onChange={vi.fn()} labels={LABELS} locale="en-US" />
      </Field>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("id", "mine");
  });

  it("shows the placeholder when empty and the formatted value when set", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DateTimePicker onChange={onChange} labels={LABELS} placeholder="Pick one" locale="en-US" />,
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
    rerender(<DateTimePicker value={VALUE} onChange={onChange} labels={LABELS} locale="en-US" />);
    expect(screen.getByRole("button", { name: /Jun 20/ })).toBeInTheDocument();
  });

  it("opens the sheet with a calendar for the value's month", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    const dialog = screen.getByRole("dialog", { name: "Starts" });
    expect(within(dialog).getByRole("group", { name: "June 2030" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "June 20, 2030" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("says the new month out loud when the arrows move it", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    const label = screen.getByText("June 2030");
    expect(label).toHaveAttribute("aria-live", "polite");
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));
    // The same element, so the live region existed before the month changed.
    expect(screen.getByText("July 2030")).toBe(label);
  });

  it("disables days before min", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    expect(screen.getByRole("button", { name: "June 14, 2030" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "June 15, 2030" })).toBeEnabled();
  });

  it("picking a day and confirming emits the combined ISO string", async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    await userEvent.click(screen.getByRole("button", { name: "June 25, 2030" }));
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const result = new Date(onChange.mock.calls[0]![0] as string);
    expect(result.getFullYear()).toBe(2030);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(25);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it("changing the time updates the draft", async () => {
    const { onChange } = setup({ minuteStep: 30 });
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Hour" }), "5");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Minutes" }), "0");
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    const result = new Date(onChange.mock.calls[0]![0] as string);
    expect(result.getHours()).toBe(17); // 5 PM — value was PM, meridiem untouched
    expect(result.getMinutes()).toBe(0);
  });

  it("arrow keys move the roving focus between days", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    const day20 = screen.getByRole("button", { name: "June 20, 2030" });
    expect(day20).toHaveAttribute("tabindex", "0");
    day20.focus();
    await userEvent.keyboard("{ArrowRight}");
    const day21 = screen.getByRole("button", { name: "June 21, 2030" });
    expect(day21).toHaveFocus();
    expect(day21).toHaveAttribute("tabindex", "0");
    expect(day20).toHaveAttribute("tabindex", "-1");
  });

  it("a 24-hour locale gets no day-period select", async () => {
    setup({ locale: "de-DE" });
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getAllByRole("combobox")).toHaveLength(2);
  });

  it("a 12-hour locale gets localized day periods", async () => {
    setup({ locale: "en-US" });
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    const period = screen.getByRole("combobox", { name: "AM/PM" });
    expect(within(period).getByRole("option", { name: "PM" })).toBeInTheDocument();
  });

  it("has no axe violations while open", async () => {
    const { container } = render(
      <DateTimePicker
        value={VALUE}
        onChange={() => {}}
        labels={LABELS}
        min={MIN}
        aria-label="Starts"
        locale="en-US"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Starts/ }));
    expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations();
    expect(container).toBeInTheDocument();
  });
});
