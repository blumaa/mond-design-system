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

  it("has no axe violations", async () => {
    const { container } = render(
      <SegmentedControl label="Range" options={options} value="day" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
