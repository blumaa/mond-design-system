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

  it("supports xs and xl sizes", () => {
    render(
      <div>
        <Avatar name="Ada" size="xs" data-testid="xs" />
        <Avatar name="Ada" size="xl" data-testid="xl" />
      </div>,
    );
    expect(screen.getByTestId("xs").className).toContain("size-xs");
    expect(screen.getByTestId("xl").className).toContain("size-xl");
  });

  it("applies a numbered tone class", () => {
    render(<Avatar name="Ada Lovelace" tone={3} data-testid="a" />);
    expect(screen.getByTestId("a").className).toContain("tone-3");
  });

  it("decorative hides it from the accessibility tree", () => {
    render(<Avatar name="Ada Lovelace" decorative data-testid="a" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("a")).toHaveAttribute("aria-hidden", "true");
  });

  it("decorative image renders empty alt", () => {
    render(<Avatar src="/x.png" name="Ada Lovelace" decorative data-testid="a" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("a").querySelector("img")).toHaveAttribute("alt", "");
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
