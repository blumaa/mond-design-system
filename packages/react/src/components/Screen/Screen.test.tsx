// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Screen, ScreenContent } from "./Screen";
import sheet from "./Screen.module.css?raw";

describe("Screen", () => {
  it("renders content inside a main region", () => {
    render(
      <Screen>
        <ScreenContent>Page body</ScreenContent>
      </Screen>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("Page body");
  });

  // The host owns the viewport: on iOS the software keyboard shrinks the
  // visual viewport without shrinking 100dvh, so only a host that mirrors
  // visualViewport can size the screen truthfully. Claiming 100dvh here would
  // overflow any frame shorter than the layout viewport.
  it("fills the host's height instead of claiming the viewport", () => {
    expect(sheet).not.toContain("100dvh");
    expect(sheet).toMatch(/\.screen\s*{[^}]*height:\s*100%/);
  });
});

describe("ScreenContent", () => {
  it("keeps the page gutter by default and drops it when flush", () => {
    const { rerender } = render(<ScreenContent>body</ScreenContent>);
    const main = screen.getByRole("main");
    expect(main.className).not.toMatch(/flush/);

    rerender(<ScreenContent flush>body</ScreenContent>);
    expect(main.className).toMatch(/flush/);
  });

  it("merges a caller className and passes main-element attributes through", () => {
    render(
      <ScreenContent className="mine" id="main-content" tabIndex={-1}>
        body
      </ScreenContent>,
    );
    const main = screen.getByRole("main");
    expect(main.className).toMatch(/content/);
    expect(main).toHaveClass("mine");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  // A screen that drives the scroll — restores an offset on back, pins a
  // thread to the bottom — needs the scrolling element itself.
  it("hands the scrolling element out through ref", () => {
    const ref = createRef<HTMLElement>();
    render(<ScreenContent ref={ref}>body</ScreenContent>);
    expect(ref.current).toBe(screen.getByRole("main"));
  });
});
