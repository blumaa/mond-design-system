// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("defaults to neutral tone", () => {
    render(<Badge data-testid="b">new</Badge>);
    expect(screen.getByTestId("b").className).toContain("tone-neutral");
  });

  it("applies tone class", () => {
    render(<Badge tone="danger" data-testid="b">9</Badge>);
    expect(screen.getByTestId("b").className).toContain("tone-danger");
  });

  it("applies the highlight tone", () => {
    render(<Badge tone="highlight" data-testid="b">going</Badge>);
    expect(screen.getByTestId("b").className).toContain("tone-highlight");
  });

  it("has no axe violations across tones", async () => {
    const { container } = render(
      <div>
        <Badge>1</Badge>
        <Badge tone="accent">2</Badge>
        <Badge tone="danger">3</Badge>
        <Badge tone="warning">4</Badge>
        <Badge tone="success">5</Badge>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
