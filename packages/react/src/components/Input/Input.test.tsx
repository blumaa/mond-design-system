// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a textbox and accepts typing", async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Name" }), "hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("defaults size md", () => {
    render(<Input aria-label="x" />);
    expect(screen.getByRole("textbox").className).toContain("size-md");
  });

  it("disabled blocks input", () => {
    render(<Input aria-label="x" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
