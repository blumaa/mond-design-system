// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes switch role with label", () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const onChange = vi.fn();
    render(<Switch label="Dark mode" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("supports controlled checked", () => {
    render(<Switch label="x" checked onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("renders label-less with an aria-label and no visible text", () => {
    render(<Switch aria-label="Email on new posts" />);
    expect(screen.getByRole("switch", { name: "Email on new posts" })).toBeInTheDocument();
    expect(screen.queryByText("Email on new posts")).not.toBeInTheDocument();
  });

  it("loading blocks toggling, announces busy, keeps the name", async () => {
    const onChange = vi.fn();
    render(<Switch label="Email" loading onChange={onChange} />);
    const input = screen.getByRole("switch", { name: "Email" });
    // Locked, not disabled: a disabled attribute would drop keyboard focus to
    // the body the instant a toggle starts its write.
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute("aria-disabled", "true");
    expect(input).toHaveAttribute("aria-busy", "true");
    await userEvent.tab();
    expect(input).toHaveFocus();
    await userEvent.click(input);
    expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toBeChecked();
    await userEvent.keyboard(" ");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Switch label="Dark mode" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
