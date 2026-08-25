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

  /* The clear affordance, inherited from the SearchField this replaced. It is
     the trailing slot's only other occupant, so the two cannot both be asked
     for — the type says so, and these say what the type cannot. */
  describe("onClear", () => {
    it("stays away until there is something to clear", () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} value="" onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
    });

    it("appears once the controlled value has text", () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} value="ho" onChange={() => {}} />);
      expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    });

    it("appears once an uncontrolled field has been typed into", async () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} />);
      expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
      await userEvent.type(screen.getByRole("textbox"), "ho");
      expect(screen.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    });

    it("calls onClear and empties an uncontrolled field", async () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} defaultValue="ho" />);
      await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
      expect(onClear).toHaveBeenCalledOnce();
      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    /* The button erases itself on the click that fires it. Without this the
       focus ring lands on document.body and the keyboard user is lost. */
    it("hands focus back to the input", async () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} defaultValue="ho" />);
      await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("pads the trailing edge for the button", () => {
      const onClear = vi.fn();
      render(<Input aria-label="Search" clearLabel="Clear search" onClear={onClear} defaultValue="ho" />);
      expect(screen.getByRole("textbox").className).toContain("with-icon-right");
    });

    it("still reaches the caller's ref", () => {
      const onClear = vi.fn();
      const ref = { current: null as HTMLInputElement | null };
      render(<Input aria-label="Search" clearLabel="Clear" onClear={onClear} ref={ref} />);
      expect(ref.current).toBe(screen.getByRole("textbox"));
    });

    it("has no axe violations with a clear button and a leading icon", async () => {
      const onClear = vi.fn();
      const { container } = render(
        <Input aria-label="Search" clearLabel="Clear search" onClear={onClear} defaultValue="ho" iconLeft={<svg />} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

});
