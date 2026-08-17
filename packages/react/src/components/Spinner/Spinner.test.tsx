// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("announces as status with a default label", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Loading");
  });

  it("takes a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Saving");
  });

  it("sizes via a per-instance custom property", () => {
    render(<Spinner size={32} />);
    const el = screen.getByRole("status");
    expect(el.style.getPropertyValue("--spinner-size")).toBe("32px");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
