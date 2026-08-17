// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { useRovingGroup } from "./useRovingGroup";

function Toolbar() {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = useRovingGroup(ref, { selector: "button" });
  return (
    <div role="toolbar" aria-label="Tools" ref={ref} onKeyDown={onKeyDown}>
      <button type="button">One</button>
      <button type="button">Two</button>
      <button type="button">Three</button>
    </div>
  );
}

describe("useRovingGroup", () => {
  it("arrow right moves focus forward, wrapping", async () => {
    render(<Toolbar />);
    screen.getByRole("button", { name: "One" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Two" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("button", { name: "One" })).toHaveFocus();
  });

  it("Home and End jump to the edges", async () => {
    render(<Toolbar />);
    screen.getByRole("button", { name: "Two" }).focus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Three" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "One" })).toHaveFocus();
  });
});
