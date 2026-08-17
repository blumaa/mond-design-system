// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Text } from "./Text";

describe("Text", () => {
  it("renders body copy as a <p> by default", () => {
    render(<Text>hello</Text>);
    const el = screen.getByText("hello");
    expect(el.tagName).toBe("P");
    expect(el.className).toContain("variant-body");
    expect(el.className).toContain("tone-primary");
  });

  it("maps variants to their default elements", () => {
    render(
      <>
        <Text variant="label">l</Text>
        <Text variant="note">n</Text>
        <Text variant="meta">m</Text>
        <Text variant="eyebrow">e</Text>
      </>,
    );
    expect(screen.getByText("l").tagName).toBe("SPAN");
    expect(screen.getByText("n").tagName).toBe("P");
    expect(screen.getByText("m").tagName).toBe("SPAN");
    expect(screen.getByText("e").tagName).toBe("SPAN");
  });

  it("variants carry default tones (note→secondary, meta/eyebrow→muted)", () => {
    render(<Text variant="meta">m</Text>);
    expect(screen.getByText("m").className).toContain("tone-muted");
  });

  it("as overrides the element, tone overrides the default", () => {
    render(<Text as="span" tone="danger">x</Text>);
    const el = screen.getByText("x");
    expect(el.tagName).toBe("SPAN");
    expect(el.className).toContain("tone-danger");
  });

  it("truncate and align add their classes", () => {
    render(<Text truncate align="center">t</Text>);
    const el = screen.getByText("t");
    expect(el.className).toContain("truncate");
    expect(el.className).toContain("align-center");
  });

  it("forwards className and arbitrary props", () => {
    render(<Text className="app" data-x="1">c</Text>);
    const el = screen.getByText("c");
    expect(el.className).toContain("app");
    expect(el).toHaveAttribute("data-x", "1");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Text>accessible</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
