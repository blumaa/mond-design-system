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

  it("loading locks the button without dropping it from the tab order", async () => {
    // A disabled attribute would throw keyboard focus back to the body the
    // moment a press starts a save — so the lock is aria-disabled plus a
    // swallowed click, and the button stays where the focus is.
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    // aria-busy already announces the state; the spinner is decorative. A live
    // spinner would prepend "Loading" to the button's accessible name.
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.tab();
    expect(btn).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).not.toHaveBeenCalled();
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

describe("Button on media", () => {
  it("says nothing about the ground it stands on by default", () => {
    render(<Button variant="ghost">Go</Button>);
    expect(screen.getByRole("button").className).not.toContain("on-media");
  });

  it("takes the on-media ground alongside its variant", () => {
    render(
      <Button variant="ghost" onMedia>
        Show
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Show" });
    expect(button.className).toContain("variant-ghost");
    expect(button.className).toContain("on-media");
  });

  it("reads the on-media palette, and only where a variant has a ground to lose", async () => {
    /* A filled button carries its own background onto the picture and needs
       nothing; the two see-through variants are the ones that would leave
       dark text on a photograph. */
    const css = (await import("./Button.module.css?raw")).default;
    expect(css).toContain(".on-media.variant-ghost");
    expect(css).toContain(".on-media.variant-secondary");
    expect(css).toContain("var(--mds-text-on-media)");
    expect(css).toContain("var(--mds-on-media-border)");
    expect(css).toContain("var(--mds-on-media-surface-hover)");
    expect(css).toContain("var(--mds-on-media-surface-active)");
    expect(css).toContain("var(--mds-on-media-focus-ring)");
    expect(css).toContain("var(--mds-on-media-dim)");
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

  it("puts its one glyph in the slot that sizes it", () => {
    /* An `iconOnly` button's glyph arrives as `children`, and `children` used to
       be handed to the element untouched — so the size of a control's glyph was
       left to the browser's default for an <svg> with a viewBox and no width.
       There is no agreement on that default: Chrome invents 300x150 and shrinks
       it to whatever the button allows, WebKit gives 0x0. The video player's
       controls and the lightbox's were invisible in Safari on exactly this. */
    render(
      <Button iconOnly aria-label="Close">
        <svg data-testid="glyph" aria-hidden="true" />
      </Button>,
    );
    expect(screen.getByTestId("glyph").parentElement?.className).toContain("slot");
  });

  it("leaves the other spelling of an icon button alone", () => {
    /* `iconLeft` with nothing between the tags is the second way this is written,
       and there a slot for the children would be an empty box beside the glyph. */
    const { container } = render(
      <Button iconOnly aria-label="Remove" iconLeft={<svg data-testid="glyph" aria-hidden="true" />} />,
    );
    expect(container.querySelectorAll("span").length).toBe(1);
  });

  it("shows the spinner in place of its glyph rather than beside it", () => {
    render(
      <Button iconOnly aria-label="Close" loading>
        <svg data-testid="glyph" aria-hidden="true" />
      </Button>,
    );
    expect(screen.queryByTestId("glyph")).not.toBeInTheDocument();
  });

  it("warning variant applies", () => {
    render(<Button variant="warning">Proceed</Button>);
    expect(screen.getByRole("button", { name: "Proceed" }).className).toContain("variant-warning");
  });
});
