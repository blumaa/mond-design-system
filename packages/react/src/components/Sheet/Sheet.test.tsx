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
  it("panel reserves the bottom safe-area inset", () => {
    const panel = sheet.match(/\.panel\s*\{[^}]*\}/)?.[0];
    expect(panel).toBeDefined();
    expect(panel).toContain("padding-bottom: var(--mds-safe-bottom)");
  });

});
