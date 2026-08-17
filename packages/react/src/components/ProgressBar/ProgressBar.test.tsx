// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes progressbar role with value semantics", () => {
    render(<ProgressBar value={40} label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps value into 0..100", () => {
    render(<ProgressBar value={140} label="x" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("value drives the fill var", () => {
    render(<ProgressBar value={40} label="x" data-testid="p" />);
    const style = screen.getByTestId("p").getAttribute("style") ?? "";
    expect(style).toContain("--progress: 40%");
  });

  it("indeterminate drops aria-valuenow", () => {
    render(<ProgressBar indeterminate label="Loading" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });

  it("has no axe violations", async () => {
    const { container } = render(<ProgressBar value={60} label="Upload" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
