// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("renders children in order", () => {
    render(
      <Stack data-testid="s">
        <span>a</span>
        <span>b</span>
      </Stack>,
    );
    expect(screen.getByTestId("s")).toHaveTextContent("ab");
  });

  it("defaults to base gap", () => {
    render(<Stack data-testid="s">x</Stack>);
    expect(screen.getByTestId("s").className).toContain("gap-base");
  });

  it("applies gap and align classes", () => {
    render(
      <Stack gap="loose" align="center" data-testid="s">
        x
      </Stack>,
    );
    const className = screen.getByTestId("s").className;
    expect(className).toContain("gap-loose");
    expect(className).toContain("align-center");
  });

  it("renders as a custom element", () => {
    render(<Stack as="section" data-testid="s">x</Stack>);
    expect(screen.getByTestId("s").tagName).toBe("SECTION");
  });
});
