// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a labelled checkbox and toggles", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={onChange} />);
    const box = screen.getByRole("checkbox", { name: "Accept terms" });
    await userEvent.click(box);
    expect(onChange).toHaveBeenCalled();
    expect(box).toBeChecked();
  });

  it("supports defaultChecked", () => {
    render(<Checkbox label="x" defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("disabled blocks toggling", async () => {
    render(<Checkbox label="x" disabled />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("takes a rich node label", () => {
    render(
      <Checkbox
        label={
          <span>
            Accept the <a href="/conduct">code of conduct</a>
          </span>
        }
      />,
    );
    expect(screen.getByRole("checkbox", { name: /accept the code of conduct/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "code of conduct" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  /* A box that governs a set of others has a third thing to say: some, not
     none and not all. The DOM only reaches it through the property, so a
     checkbox that cannot be set from props cannot say it at all. */
  describe("indeterminate", () => {
    it("sets the property, which no attribute can", () => {
      render(<Checkbox label="Select all" indeterminate />);
      expect(screen.getByRole("checkbox")).toBePartiallyChecked();
    });

    it("clears the property when the state resolves", () => {
      const { rerender } = render(<Checkbox label="Select all" indeterminate />);
      rerender(<Checkbox label="Select all" indeterminate={false} checked readOnly />);
      const box = screen.getByRole("checkbox");
      expect(box).not.toBePartiallyChecked();
      expect(box).toBeChecked();
    });

    it("is off by default", () => {
      render(<Checkbox label="x" />);
      expect(screen.getByRole("checkbox")).not.toBePartiallyChecked();
    });
  });

  /* In a table's select column there is no room for the word, and the column
     header says it anyway. The name is still owed to a reader who cannot see
     which row they are in. */
  describe("labelHidden", () => {
    it("names the box without showing the name", () => {
      render(<Checkbox label="Select Ada Lovelace" labelHidden />);
      expect(screen.getByRole("checkbox", { name: "Select Ada Lovelace" })).toBeInTheDocument();
    });

    /* Hidden by clipping, not by removal: display:none would take the name out
       of the accessibility tree, which is the one thing it is here for. */
    it("hides by clipping rather than by removing", () => {
      render(<Checkbox label="Select Ada Lovelace" labelHidden />);
      const style = getComputedStyle(screen.getByText("Select Ada Lovelace"));
      expect(style.display).not.toBe("none");
      expect(style.visibility).not.toBe("hidden");
    });

    it("still shows the name when it is not hidden", () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText("Accept terms")).toBeVisible();
    });

    it("is clean to axe", async () => {
      const { container } = render(<Checkbox label="Select Ada Lovelace" labelHidden />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
