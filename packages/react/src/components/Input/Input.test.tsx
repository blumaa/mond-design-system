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

  it("invalid marks the input outside a Field", () => {
    render(<Input aria-label="x" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("invalid={false} leaves aria-invalid off", () => {
    render(<Input aria-label="x" invalid={false} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("renders iconLeft beside the input and pads for it", () => {
    render(<Input aria-label="x" iconLeft={<svg data-testid="lead" />} />);
    expect(screen.getByTestId("lead")).toBeInTheDocument();
    expect(screen.getByRole("textbox").className).toContain("with-icon-left");
  });

  it("renders iconRight beside the input and pads for it", () => {
    render(<Input aria-label="x" iconRight={<svg data-testid="trail" />} />);
    expect(screen.getByTestId("trail")).toBeInTheDocument();
    expect(screen.getByRole("textbox").className).toContain("with-icon-right");
  });

  it("icons are decorative — hidden from the accessibility tree", () => {
    const { container } = render(<Input aria-label="x" iconLeft={<svg />} />);
    const slot = container.querySelector("[aria-hidden='true']");
    expect(slot).not.toBeNull();
    expect(slot?.querySelector("svg")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with icons and invalid", async () => {
    const { container } = render(
      <Input aria-label="Search" iconLeft={<svg />} iconRight={<svg />} invalid />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
