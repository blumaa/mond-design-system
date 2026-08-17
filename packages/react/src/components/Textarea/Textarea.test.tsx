// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("Textarea showCount", () => {
  it("shows length against the limit and tracks typing", async () => {
    render(<Textarea aria-label="Bio" maxLength={10} showCount />);
    expect(screen.getByText("0/10")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Bio"), "hello");
    expect(screen.getByText("5/10")).toBeInTheDocument();
  });

  it("native maxLength stops input at the limit", async () => {
    render(<Textarea aria-label="Bio" maxLength={4} showCount />);
    await userEvent.type(screen.getByLabelText("Bio"), "toolong");
    expect(screen.getByLabelText("Bio")).toHaveValue("tool");
    expect(screen.getByText("4/4")).toBeInTheDocument();
  });

  it("counts a controlled value", () => {
    render(<Textarea aria-label="Bio" value="abc" onChange={() => {}} maxLength={10} showCount />);
    expect(screen.getByText("3/10")).toBeInTheDocument();
  });

  it("counts without a limit", () => {
    render(<Textarea aria-label="Bio" defaultValue="abcd" showCount />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
