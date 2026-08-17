// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Modal, ModalBody } from "../components/Modal/Modal";
import { OverlayHistoryContext, type OverlayHistory } from "./overlayHistory";

function Host({ history }: { history: OverlayHistory }) {
  const [open, setOpen] = useState(true);
  return (
    <OverlayHistoryContext.Provider value={history}>
      <Modal open={open} onClose={() => setOpen(false)} label="Menu">
        <ModalBody>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </ModalBody>
      </Modal>
    </OverlayHistoryContext.Provider>
  );
}

describe("OverlayHistory wiring", () => {
  it("registers an open overlay and disposes when it closes another way", async () => {
    const dispose = vi.fn();
    const history: OverlayHistory = { register: vi.fn(() => dispose) };
    render(<Host history={history} />);
    expect(history.register).toHaveBeenCalledTimes(1);
    expect(dispose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  it("a pop closes the overlay", async () => {
    let pop: (() => void) | undefined;
    const history: OverlayHistory = {
      register: (onPop) => {
        pop = onPop;
        return () => {};
      },
    };
    render(<Host history={history} />);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();

    pop?.();
    // Exit animation holds the node mounted briefly; the close handler has run.
    await vi.waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    });
  });

  it("overlays work without a provider (context is null)", async () => {
    function Bare() {
      const [open, setOpen] = useState(true);
      return (
        <Modal open={open} onClose={() => setOpen(false)} label="Menu">
          <ModalBody>content</ModalBody>
        </Modal>
      );
    }
    render(<Bare />);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await vi.waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument();
    });
  });
});
