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

  /* A message that only arrives after a submit has to say itself: the reader
     who pressed the button is not on the field it is about. */
  it("says an error out loud, and leaves a hint quiet", () => {
    const { rerender } = render(
      <Field label="Email" hint="Work address preferred">
        <Input />
      </Field>,
    );
    expect(screen.queryByRole("alert")).toBeNull();

    rerender(
      <Field label="Email" error="Not an email">
        <Input />
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Not an email");
  });

  it("required marks the label", () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  /* The asterisk is aria-hidden decoration; without this the requirement
     never reaches assistive tech at all. */
  it("required reaches the control as aria-required", () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>,
    );
    expect(screen.getByRole("textbox")).toBeRequired();
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
