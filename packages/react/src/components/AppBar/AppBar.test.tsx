// @vitest-environment jsdom
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "../Button/Button";
import { AppBar } from "./AppBar";

describe("AppBar", () => {
  it("is a banner with a title heading", () => {
    render(<AppBar title="Sessions" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sessions" })).toBeInTheDocument();
  });

  it("renders leading and trailing slots", () => {
    render(
      <AppBar
        title="Sessions"
        leading={<Button iconOnly aria-label="Back" variant="ghost">b</Button>}
        trailing={<Button iconOnly aria-label="Search" variant="ghost">s</Button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("subtitle renders under the title, outside the heading", () => {
    render(<AppBar title="Trip crew" subtitle="4 members" />);
    expect(screen.getByRole("heading", { name: "Trip crew" })).toBeInTheDocument();
    expect(screen.getByText("4 members")).toBeInTheDocument();
    expect(screen.getByRole("heading")).not.toHaveTextContent("4 members");
  });

  it("title takes a node", () => {
    render(<AppBar title={<button type="button">Trip crew</button>} />);
    expect(screen.getByRole("heading")).toContainElement(screen.getByRole("button", { name: "Trip crew" }));
  });

  it("keeps the trailing slot at the end without a title to push it there", () => {
    render(
      <AppBar
        leading={<span>Logo</span>}
        trailing={<Button iconOnly aria-label="Search" variant="ghost">s</Button>}
      />,
    );
    const slot = screen.getByRole("button", { name: "Search" }).parentElement!;
    expect(slot.className).toMatch(/trailing/);
  });

  /* A bar is placed by the screen around it — shown from one breakpoint up,
     pinned inside a frame. That is the screen's business, not the bar's, and
     the alternative is a wrapper element between the bar and the column it
     is a flex child of. */
  it("takes a class from the screen that places it, keeping its own", () => {
    render(<AppBar title="Sessions" className="only-wide" />);
    const bar = screen.getByRole("banner");
    expect(bar.className).toContain("only-wide");
    expect(bar.className).toMatch(/bar/);
  });

  /* Flush is for bars whose content should reach the screen edge — the bar
     drops the page padding instead of the screen overriding it. */
  it("flush drops the page padding", () => {
    render(<AppBar title="Sessions" flush />);
    expect(screen.getByRole("banner").className).toMatch(/flush/);
  });

  it("keeps the page padding by default", () => {
    render(<AppBar title="Sessions" />);
    expect(screen.getByRole("banner").className).not.toMatch(/flush/);
  });

  it("passes the rest of its attributes to the header element", () => {
    render(<AppBar title="Sessions" id="top" data-testid="app-bar" />);
    expect(screen.getByTestId("app-bar")).toHaveAttribute("id", "top");
  });

  /* Spreading the rest makes the bar look like a header element to whoever
     places it, and a ref is the one thing that spread cannot carry. */
  it("hands the header element out through ref", () => {
    const ref = createRef<HTMLElement>();
    render(<AppBar title="Sessions" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("banner"));
  });

  it("has no axe violations", async () => {
    const { container } = render(<AppBar title="Sessions" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
