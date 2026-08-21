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

  it("renders the highlight variant", () => {
    render(<Button variant="highlight">Join</Button>);
    expect(screen.getByRole("button", { name: "Join" }).className).toContain("variant-highlight");
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

  it("loading disables, sets aria-busy, and keeps the accessible name", () => {
    render(<Button loading>Save</Button>);
    // aria-busy already announces the state; the spinner is decorative. A live
    // spinner would prepend "Loading" to the button's accessible name.
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
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

describe("Button shape", () => {
  it("says nothing about shape by default: the size class decides", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button").className).not.toContain("shape-");
  });

  it("takes a rectangle even where the default would round it", () => {
    render(
      <Button iconOnly aria-label="Search" shape="rect">
        <svg aria-hidden="true" />
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button.className).toContain("icon-only");
    expect(button.className).toContain("shape-rect");
  });

  it("takes a pill on a button with words in it", () => {
    render(<Button shape="pill">Follow</Button>);
    expect(screen.getByRole("button", { name: "Follow" }).className).toContain("shape-pill");
  });

  it("outranks the shape a class further up the file sets", async () => {
    /* Both `.icon-only` and `.shape-rect` are one class, so source order would
       decide which radius wins — and a stylesheet's order is not something a
       call site can see. The shape classes qualify themselves with `.button`
       to settle it. */
    const css = (await import("./Button.module.css?raw")).default;
    for (const shape of ["rect", "pill"]) {
      expect(css).toContain(`.button.shape-${shape}`);
    }
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

  it("warning variant applies", () => {
    render(<Button variant="warning">Proceed</Button>);
    expect(screen.getByRole("button", { name: "Proceed" }).className).toContain("variant-warning");
  });
});
