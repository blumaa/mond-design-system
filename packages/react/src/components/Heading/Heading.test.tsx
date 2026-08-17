// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders h2/title by default", () => {
    render(<Heading>t</Heading>);
    const el = screen.getByRole("heading", { level: 2 });
    expect(el.className).toContain("variant-title");
  });

  it("level sets the tag and its default variant", () => {
    render(<Heading level={1}>one</Heading>);
    const el = screen.getByRole("heading", { level: 1 });
    expect(el.className).toContain("variant-display");
  });

  it("variant overrides the level default", () => {
    render(<Heading level={1} variant="subtitle">s</Heading>);
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("variant-subtitle");
  });

  it("tone applies", () => {
    render(<Heading tone="inverse">i</Heading>);
    expect(screen.getByRole("heading").className).toContain("tone-inverse");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Heading level={1}>a</Heading>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
