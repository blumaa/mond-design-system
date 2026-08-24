// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Card, CardBody, CardFooter, CardHeader } from "./Card";
import sheet from "./Card.module.css?raw";

describe("Card", () => {
  it("composes header, body, footer", () => {
    render(
      <Card data-testid="c">
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    const card = screen.getByTestId("c");
    expect(card).toHaveTextContent("Title");
    expect(card).toHaveTextContent("Content");
    expect(card).toHaveTextContent("Actions");
  });

  // Shrink-wrapped, a lone block's own space-between has no free space to use.
  it("hands the row to a header's only child", () => {
    expect(sheet).toMatch(/\.header\s*>\s*:only-child\s*{[^}]*flex:\s*1/);
    expect(sheet).toMatch(/\.header\s*>\s*:only-child\s*{[^}]*min-width:\s*0/);
  });

  /* The card is the box, so the box is what says how much of a thing fits. A
     line budget clips whatever the body holds — a paragraph, two, a bare
     string — rather than asking each of them to clip itself. */
  it("takes a line budget on the body", () => {
    render(
      <Card>
        <CardBody lines={3} data-testid="clipped">
          Long
        </CardBody>
      </Card>,
    );
    expect(screen.getByTestId("clipped").style.getPropertyValue("--card-lines")).toBe("3");
  });

  it("grows to what it holds when no budget is set", () => {
    render(
      <Card>
        <CardBody data-testid="open">Long</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("open").style.getPropertyValue("--card-lines")).toBe("");
  });

  /* -webkit-box is the only display that clamps by line count, and it counts
     lines across block children as well as inline ones. */
  it("clamps the body by line count and hides the rest", () => {
    expect(sheet).toMatch(/\.clipped\s*{[^}]*-webkit-line-clamp:\s*var\(--card-lines\)/);
    expect(sheet).toMatch(/\.clipped\s*{[^}]*-webkit-box-orient:\s*vertical/);
    expect(sheet).toMatch(/\.clipped\s*{[^}]*overflow:\s*hidden/);
  });

  it("body alone works", () => {
    render(
      <Card data-testid="c">
        <CardBody>Just content</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c")).toHaveTextContent("Just content");
  });

  /* A card is not always header, body and footer. Padding that only covers the
     card's outer edges left the separation between slots to whichever one sat
     between them, so a header above a footer had none and the two rows touched,
     and a card ending on its header had no bottom padding at all. Each slot
     therefore pays for the edge it sits against and the card itself supplies
     the space between them. */
  it("spaces whichever slots are present", () => {
    expect(sheet).toMatch(/\.card\s*\{[^}]*\bgap:\s*var\(--mds-gap\)/);
    expect(sheet).toMatch(
      /\.header,\s*\.body,\s*\.footer\s*\{\s*padding:\s*0 var\(--mds-pad-card\)/,
    );
    for (const edge of ["first", "last"]) {
      const side = edge === "first" ? "top" : "bottom";
      const rule = new RegExp(
        `\\.header:${edge}-child,\\s*\\.body:${edge}-child,\\s*\\.footer:${edge}-child\\s*\\{\\s*padding-${side}:\\s*var\\(--mds-pad-card\\)`,
      );
      expect(sheet).toMatch(rule);
    }
  });

  /* A slot that holds a slot pays the card edge once. The inner one is not
     against the card at all — the outer one already stands between them — so
     paying again indents its content past everything around it. A body with a
     line budget inside a body doing layout is the case that turned this up. */
  it("pays the card edge once where a slot holds a slot", () => {
    expect(sheet).toMatch(
      /:is\(\.header, \.body, \.footer\) :is\(\.header, \.body, \.footer\)\s*\{\s*padding:\s*0/,
    );
  });

  /* The card clips its overflow, so a footer that cannot fit its controls on one
     line hides them rather than letting them spill. Four buttons that fit in
     English do not in German. */
  it("wraps a footer that cannot fit its controls", () => {
    expect(sheet).toMatch(/\.footer\s*\{[^}]*flex-wrap:\s*wrap/);
  });

  it("raised variant applies class", () => {
    render(
      <Card variant="raised" data-testid="c">
        <CardBody>x</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c").className).toContain("variant-raised");
  });

  it("sunken variant applies class", () => {
    render(
      <Card variant="sunken" data-testid="c">
        <CardBody>x</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("c").className).toContain("variant-sunken");
  });

  it("emphasis adds the accent class; plain cards lack it", () => {
    render(
      <div>
        <Card emphasis data-testid="marked"><CardBody>x</CardBody></Card>
        <Card data-testid="plain"><CardBody>y</CardBody></Card>
      </div>,
    );
    expect(screen.getByTestId("marked").className).toMatch(/emphasis/);
    expect(screen.getByTestId("plain").className).not.toMatch(/emphasis/);
  });

  it("interactive card: whole card is a button", async () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick}>
        <CardBody>Tap</CardBody>
      </Card>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Tap" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("href card: whole card is a link", () => {
    render(
      <Card href="/x">
        <CardBody>Go</CardBody>
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/x");
  });

  it("as renders the router's link as the card", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(
      <Card as={Fake} href="/x">
        <CardBody>Go</CardBody>
      </Card>,
    );
    expect(screen.getByTestId("fake")).toHaveAttribute("href", "/x");
  });

  /* A card is not always an anonymous box. One that names a section is a
     <section>, one that holds a post is an <article> — the element is what puts
     it in the outline, and no wrapper around the card can put it there. */
  it("as renders a static card as the element the content is", () => {
    render(
      <Card as="section" aria-labelledby="rail-title">
        <CardHeader>
          <h2 id="rail-title">Chapters</h2>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole("region", { name: "Chapters" }).tagName).toBe("SECTION");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Card>
          <CardHeader>Title</CardHeader>
          <CardBody>Static</CardBody>
        </Card>
        <Card onClick={() => {}}>
          <CardBody>Button</CardBody>
        </Card>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
