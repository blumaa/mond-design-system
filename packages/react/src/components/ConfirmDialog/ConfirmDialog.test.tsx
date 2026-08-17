// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  const setup = (props = {}) => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete session?"
        description="This cannot be undone."
        confirmLabel="Delete"
        {...props}
      />,
    );
    return { onConfirm, onClose };
  };

  it("renders title and description in a dialog", () => {
    setup();
    expect(screen.getByRole("dialog", { name: "Delete session?" })).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("confirm fires onConfirm", async () => {
    const { onConfirm } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cancel fires onClose", async () => {
    const { onClose, onConfirm } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("danger styles the confirm button", () => {
    setup({ danger: true });
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain("variant-danger");
  });

  it("has no axe violations", async () => {
    setup();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
