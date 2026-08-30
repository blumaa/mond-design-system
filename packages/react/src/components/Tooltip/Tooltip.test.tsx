// @vitest-environment jsdom
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Tooltip } from "./Tooltip";

/* Every assertion below is about a hover that has already dwelt long enough,
   so the delay is out of the way except in the test that is about the delay. */
function Example({ delayMs = 0 }: { delayMs?: number }) {
  return (
    <Tooltip content="Remove from heat" delayMs={delayMs}>
      <button type="button">Remove</button>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("renders nothing until the trigger is pointed at", () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("hover shows it and describes the trigger by it", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Remove" });
    await userEvent.hover(trigger);
    const tip = await screen.findByRole("tooltip");
    expect(tip).toHaveTextContent("Remove from heat");
    expect(trigger).toHaveAccessibleDescription("Remove from heat");
  });

  it("unhover hides it", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Remove" });
    await userEvent.hover(trigger);
    await screen.findByRole("tooltip");
    await userEvent.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  /* WCAG 1.4.13 (hoverable): the pointer must be able to travel from the
     trigger onto the surface — to select the text, say — without the surface
     vanishing under it. Leaving the trigger starts a short grace instead of
     hiding at once, and reaching the surface cancels it. */
  it("stays while the pointer moves onto the surface, hides on leaving it", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Remove" });
    await userEvent.hover(trigger);
    const tip = await screen.findByRole("tooltip");
    await userEvent.unhover(trigger);
    await userEvent.hover(tip);
    // Longer than the grace: if leaving the trigger had started the clock
    // anyway, the surface would be gone by now.
    await new Promise((settle) => setTimeout(settle, 300));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await userEvent.unhover(tip);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  /* A tooltip nobody can reach from the keyboard is decoration. Focus shows it
     with no dwell — the reader has already committed to the control. */
  it("keyboard focus shows it at once, even behind a hover delay", async () => {
    render(<Example delayMs={10_000} />);
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("blur hides it", async () => {
    render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  /* WCAG 1.4.13: content shown on hover or focus must be dismissable without
     moving the pointer, or it sits over what the reader was trying to read. */
  it("Escape hides it while the trigger keeps focus", async () => {
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Remove" });
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  /* Wrapping the trigger in a spare div to get a box to measure is the failure
     this avoids: the trigger stays the element the caller wrote. */
  it("attaches to the trigger itself and leaves the caller's ref working", async () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tooltip content="Remove from heat" delayMs={0}>
        <button type="button" ref={ref}>
          Remove
        </button>
      </Tooltip>,
    );
    expect(ref.current?.tagName).toBe("BUTTON");
    expect(ref.current?.parentElement).toBe(document.body.firstChild);
  });

  it("has no axe violations while shown", async () => {
    const { baseElement } = render(<Example />);
    await userEvent.hover(screen.getByRole("button", { name: "Remove" }));
    await screen.findByRole("tooltip");
    /* `region` is a page-structure rule — every node must sit inside a
       landmark — and the surface is portalled to <body> by design, outside
       whatever landmarks the app has. It is the app's page that answers that
       rule, not this component. Everything else applies. */
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
