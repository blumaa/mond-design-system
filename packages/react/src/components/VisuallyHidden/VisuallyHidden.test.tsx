// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("keeps its text where a screen reader can reach it", () => {
    render(<VisuallyHidden>Unread</VisuallyHidden>);
    expect(screen.getByText("Unread")).toBeInTheDocument();
  });

  it("is a span by default", () => {
    render(<VisuallyHidden>Unread</VisuallyHidden>);
    expect(screen.getByText("Unread").tagName).toBe("SPAN");
  });

  /* The element is half of what this component is for: a page needs its h1
     whether or not the design draws one, and a table needs its thead. A span
     wrapped around either is invalid markup that no test in a consuming app
     would catch. */
  it("takes the element the markup needs", () => {
    render(<VisuallyHidden as="h1">Discover</VisuallyHidden>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Discover");
  });

  it("carries the attributes it is given", () => {
    render(
      <VisuallyHidden role="status" aria-live="polite">
        Saved
      </VisuallyHidden>,
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  /* display:none and visibility:hidden take the text out of the accessibility
     tree, which is the whole failure this component exists to avoid. */
  it("hides by clipping rather than by removing", () => {
    render(<VisuallyHidden>Unread</VisuallyHidden>);
    const style = getComputedStyle(screen.getByText("Unread"));
    expect(style.display).not.toBe("none");
    expect(style.visibility).not.toBe("hidden");
  });

  /* An accessible name is assembled from the markup, and two inline boxes have
     their words run together: "UnreadMara replied". Absolute positioning already
     blockifies the box in a browser, so this only states what is computed —
     but it is what a test environment reads, and what a screen reader says. */
  it("keeps its word apart from the text beside it", () => {
    render(
      <a href="/n1">
        <VisuallyHidden>Unread</VisuallyHidden>
        <span>Mara replied</span>
      </a>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName("Unread Mara replied");
  });

  it("keeps a caller's className", () => {
    render(<VisuallyHidden className="k-admin__head">Columns</VisuallyHidden>);
    expect(screen.getByText("Columns").className).toContain("k-admin__head");
  });

  it("has no axe violations", async () => {
    const { container } = render(<VisuallyHidden>Unread</VisuallyHidden>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
