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

  /* Standing in for a paragraph, not for one box: a block of text ends
     mid-line, and a placeholder whose every line runs the full width reads as
     a table. */
  describe("lines", () => {
    it("draws one box per line", () => {
      render(<Skeleton lines={3} data-testid="s" />);
      expect(screen.getByTestId("s").children).toHaveLength(3);
    });

    it("cuts the last line short", () => {
      render(<Skeleton lines={3} data-testid="s" />);
      const boxes = [...screen.getByTestId("s").children];
      expect(boxes.at(-1)?.getAttribute("style")).toContain("--skeleton-w: 62%");
      expect(boxes[0]?.getAttribute("style") ?? "").not.toContain("--skeleton-w");
    });

    it("hides the block from assistive tech, not each line", () => {
      render(<Skeleton lines={2} data-testid="s" />);
      expect(screen.getByTestId("s")).toHaveAttribute("aria-hidden", "true");
    });

    it("one line is one box, with nothing wrapped around it", () => {
      render(<Skeleton lines={1} data-testid="s" />);
      expect(screen.getByTestId("s").className).toContain("variant-text");
      expect(screen.getByTestId("s").children).toHaveLength(0);
    });

    it("is only for text — a rect stays one box", () => {
      render(<Skeleton variant="rect" lines={3} data-testid="s" />);
      expect(screen.getByTestId("s").children).toHaveLength(0);
    });
  });
});
