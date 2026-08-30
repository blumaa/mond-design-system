// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { CountButton } from "./CountButton";

const glyph = <svg data-testid="glyph" />;

describe("CountButton", () => {
  it("renders with its accessible label and count", async () => {
    const onClick = vi.fn();
    render(
      <CountButton icon={glyph} label="Like" onClick={onClick}>
        12
      </CountButton>,
    );
    const button = screen.getByRole("button", { name: "Like" });
    expect(button).toHaveTextContent("12");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("sets aria-pressed only when active is given", () => {
    const { rerender } = render(<CountButton icon={glyph} label="Comment" />);
    expect(screen.getByRole("button", { name: "Comment" })).not.toHaveAttribute("aria-pressed");
    rerender(<CountButton icon={glyph} label="Like" active />);
    expect(screen.getByRole("button", { name: "Like" })).toHaveAttribute("aria-pressed", "true");
  });

  it("applies the tone class only while active", () => {
    const { rerender } = render(<CountButton icon={glyph} label="Like" active={false} data-testid="cb" />);
    expect(screen.getByTestId("cb").className).not.toContain("tone-accent");
    rerender(<CountButton icon={glyph} label="Like" active tone="danger" data-testid="cb" />);
    expect(screen.getByTestId("cb").className).toContain("tone-danger");
  });

  it("loading swaps the glyph for a spinner and locks the control", async () => {
    const onClick = vi.fn();
    render(
      <CountButton icon={glyph} label="Like" loading onClick={onClick}>
        12
      </CountButton>,
    );
    const button = screen.getByRole("button", { name: "Like" });
    // Locked, not disabled: a disabled attribute would drop keyboard focus to
    // the body the instant the press starts the write.
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByTestId("glyph")).not.toBeInTheDocument();
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <CountButton icon={glyph} label="Like" active>
          3
        </CountButton>
        <CountButton icon={glyph} label="Comment">
          8
        </CountButton>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
