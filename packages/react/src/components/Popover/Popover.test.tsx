// @vitest-environment jsdom
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Popover } from "./Popover";

function Example({ open = true, onClose = () => {} }: { open?: boolean; onClose?: () => void }) {
  const anchor = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" ref={anchor}>
        Equipment
      </button>
      <Popover open={open} onClose={onClose} anchorRef={anchor} label="Equipment list">
        <button type="button">Add</button>
      </Popover>
      <button type="button">Outside</button>
    </>
  );
}

/** The shape a real call site has: the trigger owns the open state. */
function Toggling() {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        Equipment
      </button>
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchor} label="Equipment list">
        <button type="button">Add</button>
      </Popover>
      <button type="button">Elsewhere</button>
    </>
  );
}

describe("Popover", () => {
  it("closed renders nothing", () => {
    render(<Example open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("open renders a named dialog holding its content", () => {
    render(<Example />);
    const panel = screen.getByRole("dialog", { name: "Equipment list" });
    expect(panel).toHaveTextContent("Add");
  });

  /* A popover leaves the page live behind it — that is the whole difference
     between it and a modal — so claiming aria-modal would lie to a screen
     reader about what is still reachable. */
  it("does not claim to be modal", () => {
    render(<Example />);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
    expect(document.body).not.toHaveStyle({ overflow: "hidden" });
  });

  it("moves focus into the panel on open and back to the trigger on close", async () => {
    render(<Toggling />);
    const trigger = screen.getByRole("button", { name: "Equipment" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("Escape closes", async () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a press outside closes; a press inside does not", async () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /* Pressing the trigger of an open popover must close it once, not close it
     on pointerdown and reopen it on the click that follows. */
  it("a press on the trigger closes it and leaves it closed", async () => {
    render(<Toggling />);
    const trigger = screen.getByRole("button", { name: "Equipment" });
    await userEvent.click(trigger);
    const panel = screen.getByRole("dialog");
    await userEvent.click(trigger);
    // It leaves on its exit transition, so the assertion is that it goes and
    // stays gone — the bug this guards reopened it on the click after the
    // pointerdown, which would put a second panel back before this resolves.
    await waitForElementToBeRemoved(panel);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  /* Non-modal means the page is still there to Tab to. Trapping Tab inside
     the panel would contradict the very thing the role communicates. */
  it("does not trap Tab inside the panel", async () => {
    render(<Example />);
    screen.getByRole("button", { name: "Add" }).focus();
    await userEvent.tab();
    const panel = screen.getByRole("dialog");
    expect(panel.contains(document.activeElement)).toBe(false);
  });

  /* A press elsewhere on the page already put focus where the reader wanted
     it; pulling it back to the trigger on dismissal would undo their move. */
  it("an outside dismissal leaves focus where the reader put it", async () => {
    render(<Toggling />);
    const trigger = screen.getByRole("button", { name: "Equipment" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveFocus();
    // The reader tabbed out to the page, then pressed a blank spot. Just the
    // pointerdown: the browser's own follow-up (blur towards the press) is
    // not the popover's doing and would mask a focus yank back to the trigger.
    const elsewhere = screen.getByRole("button", { name: "Elsewhere" });
    elsewhere.focus();
    fireEvent.pointerDown(document.body);
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
    expect(elsewhere).toHaveFocus();
  });

  it("pins itself to the anchor above the page", () => {
    render(<Example />);
    expect(screen.getByRole("dialog")).toHaveStyle({ position: "fixed" });
  });

  it("has no axe violations", async () => {
    const { baseElement } = render(<Example />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
