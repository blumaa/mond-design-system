// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inline } from "./Inline";

describe("Inline", () => {
  it("defaults: base gap, center align", () => {
    render(<Inline data-testid="i">x</Inline>);
    const className = screen.getByTestId("i").className;
    expect(className).toContain("gap-base");
    expect(className).toContain("align-center");
  });

  it("applies gap, align, justify, wrap", () => {
    render(
      <Inline gap="tight" align="start" justify="between" wrap data-testid="i">
        x
      </Inline>,
    );
    const className = screen.getByTestId("i").className;
    expect(className).toContain("gap-tight");
    expect(className).toContain("align-start");
    expect(className).toContain("justify-between");
    expect(className).toContain("wrap");
  });
});
