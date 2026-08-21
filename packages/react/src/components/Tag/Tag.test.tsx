// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders its content", () => {
    render(<Tag>shibari</Tag>);
    expect(screen.getByText("shibari")).toBeInTheDocument();
  });

  it("applies tone class", () => {
    render(<Tag tone="accent" data-testid="t">x</Tag>);
    expect(screen.getByTestId("t").className).toContain("tone-accent");
  });

  it("without onRemove there is no button", () => {
    render(<Tag>x</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("onRemove renders a labelled remove button and fires", async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove} removeLabel="Remove ropes">ropes</Tag>);
    await userEvent.click(screen.getByRole("button", { name: "Remove ropes" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Tag>plain</Tag>
        <Tag onRemove={() => {}} removeLabel="Remove removable">removable</Tag>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
