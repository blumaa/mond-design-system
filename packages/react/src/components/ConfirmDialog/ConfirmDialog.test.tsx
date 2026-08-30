// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  const setup = (props = {}) => {
    const onConfirm = vi.fn(() => Promise.resolve());
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete session?"
        description="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        {...props}
      />,
    );
    return { onConfirm, onClose };
  };

  it("renders title and description in an alertdialog", () => {
    setup();
    expect(screen.getByRole("alertdialog", { name: "Delete session?" })).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("confirm fires onConfirm, then closes once it resolves", async () => {
    const { onConfirm, onClose } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("cancel fires onClose", async () => {
    const { onClose, onConfirm } = setup();
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("tone danger styles the confirm button", () => {
    setup({ tone: "danger" });
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain("variant-danger");
  });

  it("tone warning styles the confirm button", () => {
    setup({ tone: "warning" });
    expect(screen.getByRole("button", { name: "Delete" }).className).toContain("variant-warning");
  });

  it("has no axe violations", async () => {
    setup();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

describe("ConfirmDialog lifecycle", () => {
  it("stays open and busy while the action is pending; cancel remains operable", async () => {
    let resolve!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    const confirm = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(confirm);
    // aria-disabled, not disabled: the lock must not drop keyboard focus.
    expect(confirm).toHaveAttribute("aria-disabled", "true");
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
    expect(onClose).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    resolve();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("a rejection keeps the dialog open with the reason announced", async () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={() => Promise.reject(new Error("Network down"))}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Network down");
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  });

  it("errorMessage rephrases the failure", async () => {
    render(
      <ConfirmDialog
        open
        onClose={() => {}}
        onConfirm={() => Promise.reject(new Error("409"))}
        errorMessage={(m) => `Could not delete (${m}).`}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not delete (409).");
  });

  it("hands onConfirm the target it was asked about, and opens from it", async () => {
    const onConfirm = vi.fn((id: number) => Promise.resolve(id));
    render(
      <ConfirmDialog
        target={42}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirm).toHaveBeenCalledWith(42);
  });

  it("target null keeps it closed", () => {
    render(
      <ConfirmDialog
        target={null}
        onClose={() => {}}
        onConfirm={(id: number) => Promise.resolve(id)}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("a fresh question starts idle after an earlier failure", async () => {
    const failing = () => Promise.reject(new Error("boom"));
    const { rerender } = render(
      <ConfirmDialog
        open
        onClose={() => {}}
        onConfirm={failing}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("alert");
    rerender(
      <ConfirmDialog
        open={false}
        onClose={() => {}}
        onConfirm={failing}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    rerender(
      <ConfirmDialog
        open
        onClose={() => {}}
        onConfirm={failing}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("ConfirmDialog dismissal", () => {
  it("ignores scrim clicks — the choice must be explicit", async () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={() => Promise.resolve()}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    await userEvent.click(screen.getByTestId("mds-scrim"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("Escape still closes", async () => {
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        open
        onClose={onClose}
        onConfirm={() => Promise.resolve()}
        title="Delete session?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
