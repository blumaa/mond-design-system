// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a type=button with primary/md defaults", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveAttribute("type", "button");
    expect(btn.className).toContain("variant-primary");
    expect(btn.className).toContain("size-md");
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disabled blocks clicks", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("loading disables, sets aria-busy, and shows a spinner", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders icon slots", () => {
    render(<Button iconLeft={<svg data-testid="l" />} iconRight={<svg data-testid="r" />}>Go</Button>);
    expect(screen.getByTestId("l")).toBeInTheDocument();
    expect(screen.getByTestId("r")).toBeInTheDocument();
  });

  it("href renders a link", () => {
    render(<Button href="/x">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("as renders a custom element (router link)", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(<Button as={Fake} href="/y">Go</Button>);
    expect(screen.getByTestId("fake")).toHaveAttribute("href", "/y");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Button iconOnly", () => {
  it("renders a square icon button with an accessible name", () => {
    render(
      <Button iconOnly aria-label="Search" variant="ghost">
        <svg aria-hidden="true" />
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button.className).toContain("icon-only");
  });

  it("requires aria-label at the type level", () => {
    // @ts-expect-error — iconOnly without aria-label must not compile
    const invalid = <Button iconOnly>x</Button>;
    void invalid;
  });

  it("keeps variants and disabled behaviour", () => {
    render(
      <Button iconOnly aria-label="Delete" variant="danger" disabled>
        <svg aria-hidden="true" />
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toBeDisabled();
    expect(button.className).toContain("variant-danger");
  });
});
