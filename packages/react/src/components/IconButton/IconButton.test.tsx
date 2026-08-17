// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("names itself from the required label", () => {
    render(<IconButton label="Close"><svg /></IconButton>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<IconButton label="Close" onClick={onClick}><svg /></IconButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("variant and size classes apply", () => {
    render(<IconButton label="x" variant="primary" size="lg"><svg /></IconButton>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("variant-primary");
    expect(btn.className).toContain("size-lg");
  });

  it("has no axe violations", async () => {
    const { container } = render(<IconButton label="Close"><svg /></IconButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
