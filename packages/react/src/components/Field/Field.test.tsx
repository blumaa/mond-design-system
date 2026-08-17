// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Field } from "./Field";
import { Input } from "../Input/Input";

describe("Field", () => {
  it("wires label to the control", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("hint is announced via aria-describedby", () => {
    render(
      <Field label="Email" hint="Work address preferred">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("Work address preferred");
  });

  it("error replaces hint in the description and flags the control invalid", () => {
    render(
      <Field label="Email" hint="Work address preferred" error="Not an email">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAccessibleDescription("Not an email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("required marks the label", () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Field label="A" hint="hint">
          <Input />
        </Field>
        <Field label="B" error="broken">
          <Input />
        </Field>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
