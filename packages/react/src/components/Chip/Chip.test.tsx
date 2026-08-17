// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders as a static span without onClick", () => {
    render(<Chip>Padel</Chip>);
    expect(screen.getByText("Padel")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders as a button when onClick is set, and fires", async () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>Filter</Chip>);
    await userEvent.click(screen.getByRole("button", { name: "Filter" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("exposes toggle state via aria-pressed when selected is given", () => {
    render(
      <Chip onClick={() => {}} selected>
        On
      </Chip>,
    );
    expect(screen.getByRole("button", { name: "On" })).toHaveAttribute("aria-pressed", "true");
  });

  it("omits aria-pressed for a plain action chip", () => {
    render(<Chip onClick={() => {}}>Go</Chip>);
    expect(screen.getByRole("button", { name: "Go" })).not.toHaveAttribute("aria-pressed");
  });

  it("disabled chip does not fire", async () => {
    const onClick = vi.fn();
    render(
      <Chip onClick={onClick} disabled>
        Off
      </Chip>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Off" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant and selected classes", () => {
    render(
      <Chip variant="outline" selected data-testid="c">
        x
      </Chip>,
    );
    const el = screen.getByTestId("c");
    expect(el.className).toContain("variant-outline");
    expect(el.className).toContain("selected");
  });

  it("renders a leading icon slot", () => {
    render(<Chip icon={<svg data-testid="glyph" />}>With icon</Chip>);
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Chip>static</Chip>
        <Chip onClick={() => {}} selected>
          toggle
        </Chip>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
