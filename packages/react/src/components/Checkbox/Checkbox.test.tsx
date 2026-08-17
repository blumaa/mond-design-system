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
});
