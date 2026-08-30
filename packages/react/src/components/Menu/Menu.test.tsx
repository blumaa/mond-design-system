// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Menu, MenuItem } from "./Menu";

function Example({
  onEdit = () => {},
  onDelete = () => {},
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Menu label="Heat actions" trigger={<button type="button">Actions</button>}>
      <MenuItem onSelect={onEdit}>Edit</MenuItem>
      <MenuItem onSelect={onDelete} tone="danger">
        Delete
      </MenuItem>
      <MenuItem onSelect={() => {}} disabled>
        Archive
      </MenuItem>
    </Menu>
  );
}

const trigger = () => screen.getByRole("button", { name: "Actions" });

describe("Menu", () => {
  it("closed renders only the trigger, marked as opening a menu", () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("the trigger opens a named menu of items and marks itself expanded", async () => {
    render(<Example />);
    await userEvent.click(trigger());
    expect(screen.getByRole("menu", { name: "Heat actions" })).toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  /* APG menu button: opening puts focus on the first item, so the next arrow
     key moves rather than opens. */
  it("focuses the first item on open", async () => {
    render(<Example />);
    await userEvent.click(trigger());
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
  });

  it("ArrowDown on the trigger opens it", async () => {
    render(<Example />);
    trigger().focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  /* APG menu button: ArrowUp opens with focus on the last item — the reader
     asked to come in from the bottom. */
  it("ArrowUp on the trigger opens it with the last enabled item focused", async () => {
    render(<Example />);
    trigger().focus();
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus());
  });

  /* APG menu button: Tab closes the menu and moves on. The menu hands focus
     to the trigger and leaves the key to the browser, whose own default then
     carries it to the stop after the trigger — not wherever the portal sits
     in the DOM. (userEvent.tab picks its destination before handlers run, so
     the browser half is asserted as "the key was not swallowed".) */
  it("Tab closes the menu and leaves the key for the browser to move on with", async () => {
    render(<Example />);
    await userEvent.click(trigger());
    const item = screen.getByRole("menuitem", { name: "Edit" });
    await waitFor(() => expect(item).toHaveFocus());
    const letThrough = fireEvent.keyDown(item, { key: "Tab" });
    expect(letThrough).toBe(true);
    expect(trigger()).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("the trigger says which menu it controls while it is open", async () => {
    render(<Example />);
    expect(trigger()).not.toHaveAttribute("aria-controls");
    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute("aria-controls", screen.getByRole("menu").id);
  });

  it("arrow keys move between items and wrap", async () => {
    render(<Example />);
    await userEvent.click(trigger());
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    // Past the last enabled item and back round to the first.
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("choosing an item runs it, closes the menu and returns focus to the trigger", async () => {
    const onEdit = vi.fn();
    render(<Example onEdit={onEdit} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  it("a disabled item does nothing and cannot be reached by arrow", async () => {
    const onDelete = vi.fn();
    render(<Example onDelete={onDelete} />);
    await userEvent.click(trigger());
    const archive = screen.getByRole("menuitem", { name: "Archive" });
    expect(archive).toBeDisabled();
    await userEvent.click(archive);
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("Escape closes it and returns focus to the trigger", async () => {
    render(<Example />);
    await userEvent.click(trigger());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  it("a press outside closes it", async () => {
    render(
      <>
        <Example />
        <button type="button">Elsewhere</button>
      </>,
    );
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("button", { name: "Elsewhere" }));
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
  });

  it("has no axe violations while open", async () => {
    const { baseElement } = render(<Example />);
    await userEvent.click(trigger());
    /* See Tooltip: `region` is about the app's page structure, and the menu is
       portalled to <body> outside whatever landmarks the app has. */
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
