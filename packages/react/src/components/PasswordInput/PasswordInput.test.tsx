// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Field } from "../Field/Field";
import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("starts hidden as type password", () => {
    render(
      <Field label="Password">
        <PasswordInput showLabel="Show password" hideLabel="Hide password" />
      </Field>,
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("reveal toggle switches to text and back", async () => {
    render(
      <Field label="Password">
        <PasswordInput showLabel="Show password" hideLabel="Hide password" />
      </Field>,
    );
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("inherits Field wiring like Input", () => {
    render(
      <Field label="Password" error="Too short">
        <PasswordInput showLabel="Show password" hideLabel="Hide password" />
      </Field>,
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Too short");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Field label="Password">
        <PasswordInput showLabel="Show password" hideLabel="Hide password" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
