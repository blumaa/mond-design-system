// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders an image when src is given", () => {
    render(<Avatar src="/x.png" name="Ada Lovelace" />);
    const img = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(img).toHaveAttribute("src", "/x.png");
  });

  it("falls back to initials without src", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("initials come from first and last word only", () => {
    render(<Avatar name="Ada Byron King Lovelace" />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("single-word name yields one initial", () => {
    render(<Avatar name="Ada" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("initials fallback keeps the accessible name", () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("applies size class", () => {
    render(<Avatar name="Ada Lovelace" size="lg" data-testid="a" />);
    expect(screen.getByTestId("a").className).toContain("size-lg");
  });

  it("has no axe violations in both modes", async () => {
    const { container } = render(
      <div>
        <Avatar name="Ada Lovelace" />
        <Avatar src="/x.png" name="Grace Hopper" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
