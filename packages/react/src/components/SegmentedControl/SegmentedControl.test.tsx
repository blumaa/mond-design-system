// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

describe("SegmentedControl", () => {
  it("renders a labelled radiogroup", () => {
    render(<SegmentedControl label="Range" options={options} value="day" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup", { name: "Range" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("reflects the selected value", () => {
    render(<SegmentedControl label="Range" options={options} value="week" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "Week" })).toBeChecked();
  });

  it("clicking a segment fires onChange with its value", async () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Range" options={options} value="day" onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("disabled blocks every segment and the change callback", async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl label="Range" options={options} value="day" onChange={onChange} disabled />,
    );
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onChange).not.toHaveBeenCalled();
  });

    it("fullWidth stretches the group across its container", () => {
    render(
      <SegmentedControl
        label="View"
        fullWidth
        options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
        value="a"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("radiogroup").className).toMatch(/fullWidth/);
  });

  /* Header chrome — a language switch beside the avatar — is a quiet control
     next to loud ones. The frame is what makes the group read as a form field,
     and a field is exactly what it is not up there. */
  it("bare drops the frame for chrome that should not read as a field", () => {
    render(
      <SegmentedControl
        label="Language"
        bare
        options={[{ value: "en", label: "EN" }, { value: "de", label: "DE" }]}
        value="en"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("radiogroup").className).toMatch(/bare/);
  });

  it("says nothing about a frame it has not been asked to drop", () => {
    render(
      <SegmentedControl label="Language" options={options} value="day" onChange={() => {}} />,
    );
    expect(screen.getByRole("radiogroup").className).not.toMatch(/bare/);
  });

  it("takes the small step, for the same chrome", () => {
    render(
      <SegmentedControl
        label="Language"
        size="sm"
        options={options}
        value="day"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("radiogroup").className).toMatch(/size-sm/);
  });

  it("stands at the medium step by default", () => {
    render(<SegmentedControl label="Range" options={options} value="day" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup").className).toMatch(/size-md/);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SegmentedControl label="Range" options={options} value="day" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
