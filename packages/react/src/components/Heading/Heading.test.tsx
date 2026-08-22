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

  /* A section title is not always a big one: a rail beside the page, a group
     inside a form. The outline level is what makes it a heading; the type role
     is free to be the small one. */
  it("takes the label type role while staying a heading", () => {
    render(<Heading level={2} variant="label">rail</Heading>);
    expect(screen.getByRole("heading", { level: 2 }).className).toContain("variant-label");
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
