// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("announces as status, named by the label the caller passed", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Saving");
  });

  it("sizes via a per-instance custom property", () => {
    render(<Spinner label="Loading" size={32} />);
    const el = screen.getByRole("status");
    expect(el.style.getPropertyValue("--spinner-size")).toBe("32px");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Spinner label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
