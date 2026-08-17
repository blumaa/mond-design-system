// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("is a separator", () => {
    render(<Divider />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("defaults horizontal", () => {
    render(<Divider />);
    expect(screen.getByRole("separator").className).toContain("horizontal");
  });

  it("vertical sets aria-orientation", () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
