// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Field } from "../Field/Field";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textbox with rows", () => {
    render(<Textarea aria-label="Notes" rows={5} />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute("rows", "5");
  });

  it("participates in Field wiring", () => {
    render(
      <Field label="Notes" error="Too long">
        <Textarea />
      </Field>,
    );
    expect(screen.getByLabelText("Notes")).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
