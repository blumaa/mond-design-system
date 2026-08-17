// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to text variant", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("variant-text");
  });

  it("applies variant class", () => {
    render(<Skeleton variant="circle" data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("variant-circle");
  });

  it("width and height land as inline size vars", () => {
    render(<Skeleton width="12rem" height="1.5rem" data-testid="s" />);
    const style = screen.getByTestId("s").getAttribute("style") ?? "";
    expect(style).toContain("--skeleton-w: 12rem");
    expect(style).toContain("--skeleton-h: 1.5rem");
  });
});
