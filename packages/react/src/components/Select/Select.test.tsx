// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Field } from "../Field/Field";
import { Select } from "./Select";

describe("Select", () => {
  it("renders a native combobox with options", async () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Fruit" onChange={onChange}>
        <option value="a">Apple</option>
        <option value="b">Banana</option>
      </Select>,
    );
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Fruit" }), "b");
    expect(onChange).toHaveBeenCalled();
  });

  it("participates in Field wiring", () => {
    render(
      <Field label="Fruit">
        <Select>
          <option>Apple</option>
        </Select>
      </Field>,
    );
    expect(screen.getByLabelText("Fruit")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Select aria-label="Fruit">
        <option>Apple</option>
      </Select>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
