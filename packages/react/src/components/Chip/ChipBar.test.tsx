// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Chip } from "./Chip";
import { ChipBar } from "./ChipBar";

describe("ChipBar", () => {
  it("renders its children", () => {
    render(
      <ChipBar>
        <Chip>a</Chip>
        <Chip>b</Chip>
      </ChipBar>,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });

  it("applies bordered and fade classes", () => {
    render(
      <ChipBar bordered data-testid="bar">
        <Chip>a</Chip>
      </ChipBar>,
    );
    const el = screen.getByTestId("bar");
    expect(el.className).toContain("bordered");
    expect(el.className).toContain("fade");
  });

  it("fade can be turned off", () => {
    render(
      <ChipBar fade={false} data-testid="bar">
        <Chip>a</Chip>
      </ChipBar>,
    );
    expect(screen.getByTestId("bar").className).not.toContain("fade");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ChipBar>
        <Chip onClick={() => {}} selected>
          All
        </Chip>
        <Chip onClick={() => {}} selected={false}>
          Games
        </Chip>
      </ChipBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
