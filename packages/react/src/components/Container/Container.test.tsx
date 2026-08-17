// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("defaults to content width", () => {
    render(<Container data-testid="c">x</Container>);
    expect(screen.getByTestId("c").className).toContain("width-content");
  });

  it("wide width", () => {
    render(<Container width="wide" data-testid="c">x</Container>);
    expect(screen.getByTestId("c").className).toContain("width-wide");
  });

  it("renders as a custom element", () => {
    render(<Container as="main" data-testid="c">x</Container>);
    expect(screen.getByTestId("c").tagName).toBe("MAIN");
  });
});
