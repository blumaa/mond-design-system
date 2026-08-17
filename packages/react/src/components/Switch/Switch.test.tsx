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

  it("has no axe violations", async () => {
    const { container } = render(<Switch label="Dark mode" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
