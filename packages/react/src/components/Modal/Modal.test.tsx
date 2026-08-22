// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./Modal";

function Example({ open = true, onClose = () => {} }: { open?: boolean; onClose?: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="Edit session">
      <ModalHeader>Edit session</ModalHeader>
      <ModalBody>
        <button type="button">Inside</button>
      </ModalBody>
      <ModalFooter>Footer</ModalFooter>
    </Modal>
  );
}

describe("Modal", () => {
  it("ModalHeader puts the title in the outline", () => {
    render(
      <Modal open onClose={() => {}} label="Edit session">
        <ModalHeader>Edit session</ModalHeader>
      </Modal>,
    );
    expect(screen.getByRole("heading", { name: "Edit session", level: 2 })).toBeInTheDocument();
  });

  it("closed renders nothing", () => {
    render(<Example open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("open renders a named modal dialog with sections", () => {
    render(<Example />);
    const dialog = screen.getByRole("dialog", { name: "Edit session" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("Footer");
  });

  it("Escape closes", async () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("scrim click closes, inside click does not", async () => {
    const onClose = vi.fn();
    render(<Example onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Inside" }));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByTestId("mds-scrim"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog on open", () => {
    render(<Example />);
    expect(screen.getByRole("dialog")).toHaveFocus();
  });

  it("has no axe violations", async () => {
    const { baseElement } = render(<Example />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it("role=alertdialog overrides the default dialog role", () => {
    render(
      <Modal open onClose={() => {}} label="Sure?" role="alertdialog">
        x
      </Modal>,
    );
    expect(screen.getByRole("alertdialog", { name: "Sure?" })).toBeInTheDocument();
  });
});
