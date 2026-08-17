// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Chip } from "./Chip";
import { ChipGroup } from "./ChipGroup";

describe("ChipGroup", () => {
  it("renders its children", () => {
    render(
      <ChipGroup>
        <Chip>a</Chip>
        <Chip>b</Chip>
      </ChipGroup>,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });

  it("applies the gap class", () => {
    render(
      <ChipGroup gap="base" data-testid="g">
        <Chip>a</Chip>
      </ChipGroup>,
    );
    expect(screen.getByTestId("g").className).toContain("gap-base");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ChipGroup>
        <Chip onClick={() => {}} selected>
          Mon
        </Chip>
        <Chip onClick={() => {}} selected={false}>
          Tue
        </Chip>
      </ChipGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
