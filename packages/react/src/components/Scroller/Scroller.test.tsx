// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Scroller } from "./Scroller";

const LABELS = { previous: "Previous", next: "Next" };

const draw = (extra?: Partial<Parameters<typeof Scroller>[0]>) =>
  render(
    <Scroller title="Featured" labels={LABELS} {...extra}>
      <p>one</p>
      <p>two</p>
    </Scroller>,
  );

/** jsdom lays nothing out and pins scrollLeft to 0, so the row says where it
    stands and how wide it is, and then says it has scrolled. */
function measure(track: HTMLElement, { at, width, content }: { at: number; width: number; content: number }) {
  for (const [name, value] of [
    ["clientWidth", width],
    ["scrollWidth", content],
    ["scrollLeft", at],
  ] as const) {
    Object.defineProperty(track, name, { value, configurable: true });
  }

  fireEvent.scroll(track);
}

const track = () => screen.getByRole("group", { name: "Featured" });

describe("Scroller", () => {
  it("titles the strip and names the row of items with the same words", () => {
    draw();

    expect(screen.getByRole("heading", { name: "Featured" })).toBeInTheDocument();
    expect(track()).toBeInTheDocument();
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("takes the heading level the page needs", () => {
    draw({ level: 3 });

    expect(screen.getByRole("heading", { name: "Featured", level: 3 })).toBeInTheDocument();
  });

  /* Nothing to scroll to is nothing to press. */
  it("holds both arrows shut while everything already fits", () => {
    draw();

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("opens the way forward once there is more to the right of the edge", () => {
    draw();
    const row = track();
    measure(row, { at: 0, width: 300, content: 900 });

    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  it("closes the way forward at the end of the row and opens the way back", () => {
    draw();
    const row = track();
    measure(row, { at: 600, width: 300, content: 900 });

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  /* Not a whole screenful: the item at the edge stays half in view, so the
     reader keeps their place in the row. */
  it("steps by most of a screenful, in the direction pressed", async () => {
    draw();
    const row = track();
    const scrollBy = vi.fn();
    row.scrollBy = scrollBy;
    measure(row, { at: 0, width: 300, content: 900 });

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 240 });

    measure(row, { at: 240, width: 300, content: 900 });

    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -240 });
  });

  it("puts what the app hangs on the title beside it", () => {
    draw({ action: <a href="/library">See all</a> });

    expect(screen.getByRole("link", { name: "See all" })).toBeInTheDocument();
  });
});
