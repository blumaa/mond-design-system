// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Icon, IconProvider } from "./Icon";

const renderIcon = (name: string, { size }: { size: number }) => (
  <svg data-testid={`icon-${name}`} width={size} height={size} />
);

describe("Icon", () => {
  it("resolves the glyph through the provider", () => {
    render(
      <IconProvider render={renderIcon}>
        <Icon name="close" />
      </IconProvider>,
    );
    expect(screen.getByTestId("icon-close")).toBeInTheDocument();
  });

  it("is decorative by default, labelled on request", () => {
    render(
      <IconProvider render={renderIcon}>
        <Icon name="close" data-testid="deco" />
        <Icon name="search" label="Search" />
      </IconProvider>,
    );
    expect(screen.getByTestId("deco")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("img")).toHaveAccessibleName("Search");
  });

  it("passes the size step's pixel value to the renderer", () => {
    render(
      <IconProvider render={renderIcon}>
        <Icon name="close" size="lg" />
      </IconProvider>,
    );
    expect(screen.getByTestId("icon-close")).toHaveAttribute("width", "24");
  });

  it("renders an empty box and warns without a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Icon name="ghost" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toBeEmptyDOMElement();
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <IconProvider render={renderIcon}>
        <Icon name="close" />
        <Icon name="search" label="Search" />
      </IconProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
