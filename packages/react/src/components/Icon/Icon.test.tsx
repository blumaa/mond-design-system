// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type { IconRenderProps } from "./Icon";
import { Icon, IconProvider } from "./Icon";
import sheet from "./Icon.module.css?raw";

const renderIcon = (name: string, { size }: IconRenderProps) => (
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

  it("leaves the size to the slot when none is stated", () => {
    const steps: Array<number | undefined> = [];
    render(
      <IconProvider
        render={(name, { size }) => {
          steps.push(size);
          return <svg data-testid={`icon-${name}`} />;
        }}
      >
        <Icon name="close" />
        <Icon name="search" size="sm" />
      </IconProvider>,
    );
    expect(steps).toEqual([undefined, 16]);
  });

  it("renders an empty box and warns without a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Icon name="ghost" data-testid="empty" />);
    expect(screen.getByTestId("empty")).toBeEmptyDOMElement();
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  /* An svg carrying only a viewBox has no agreed size: Chrome invents one and
     WebKit gives it 0x0, so the mark is simply gone in Safari. The control
     slots size their glyph with `.slot > svg`, which this span sits in the
     middle of, so the span has to size what it holds. */
  it("sizes the glyph it holds to the slot", () => {
    expect(sheet).toMatch(/\.icon\s*>\s*svg\s*{[^}]*width:\s*100%/);
    expect(sheet).toMatch(/\.icon\s*>\s*svg\s*{[^}]*height:\s*100%/);
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
