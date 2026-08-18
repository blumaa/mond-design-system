// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet, SheetBody, SheetHeader } from "./Sheet";
import sheet from "./Sheet.module.css?raw";

describe("Sheet", () => {
  it("open renders a named modal dialog", () => {
    render(
      <Sheet open onClose={() => {}} label="Filters">
        <SheetHeader>Filters</SheetHeader>
        <SheetBody>Options</SheetBody>
      </Sheet>,
    );
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("Options");
  });

  it("Escape closes", async () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} label="Filters">
        <SheetBody>x</SheetBody>
      </Sheet>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closed renders nothing", () => {
    render(
      <Sheet open={false} onClose={() => {}} label="Filters">
        <SheetBody>x</SheetBody>
      </Sheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // jsdom computes no real styles, so the stylesheet is the fixture: the panel
  // portals past the app chrome, and without this inset a sheet's footer
  // actions sit under the iPhone home bar.
  it("caps the panel against its scrim, not the dynamic viewport", () => {
    const panel = sheet.match(/\.panel\s*\{[^}]*\}/)?.[0];
    expect(panel).toBeDefined();
    // The scrim is the flex host and already tracks --mds-vvh; a dvh cap here
    // would overshoot it whenever the keyboard is up.
    expect(panel).not.toContain("dvh");
    expect(panel).toContain("max-height: 85%");
  });

  it("panel reserves the bottom safe-area inset", () => {
    const panel = sheet.match(/\.panel\s*\{[^}]*\}/)?.[0];
    expect(panel).toBeDefined();
    expect(panel).toContain("padding-bottom: var(--mds-safe-bottom)");
  });

  it("SheetHeader with onClose renders a close button that closes", async () => {
    const onClose = vi.fn();
    render(
      <Sheet open onClose={onClose} label="Filters">
        <SheetHeader onClose={onClose} closeLabel="Close">
          Filters
        </SheetHeader>
        <SheetBody>x</SheetBody>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("SheetHeader without onClose renders no button", () => {
    render(
      <Sheet open onClose={() => {}} label="Filters">
        <SheetHeader>Filters</SheetHeader>
        <SheetBody>x</SheetBody>
      </Sheet>,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

});
