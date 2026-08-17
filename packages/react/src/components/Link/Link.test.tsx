// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Link } from "./Link";
import sheet from "./Link.module.css?raw";

describe("Link", () => {
  it("renders an anchor with inline variant by default", () => {
    render(<Link href="/a">go</Link>);
    const a = screen.getByRole("link", { name: "go" });
    expect(a).toHaveAttribute("href", "/a");
    expect(a.className).toContain("variant-inline");
  });

  it("standalone variant applies", () => {
    render(<Link href="/a" variant="standalone">go</Link>);
    expect(screen.getByRole("link").className).toContain("variant-standalone");
  });

  it("external adds target and rel", () => {
    render(<Link href="https://x.test" external>out</Link>);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("as renders a router link component", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(<Link as={Fake} href="/r">r</Link>);
    expect(screen.getByTestId("fake")).toHaveAttribute("href", "/r");
  });

  it("as accepts a router link's own props", () => {
    // Routers name the destination `to`, not `href` — the polymorphic typing
    // has to admit it or every router link needs an adapter.
    const Router = ({ to, ...rest }: { to: string } & React.ComponentProps<"a">) => (
      <a data-testid="router" href={to} {...rest} />
    );
    render(<Link as={Router} to="/dest">go</Link>);
    expect(screen.getByTestId("router")).toHaveAttribute("href", "/dest");
  });

  it("plain variant applies", () => {
    render(<Link href="/a" variant="plain">go</Link>);
    expect(screen.getByRole("link").className).toContain("variant-plain");
  });

  it("size applies a scale class, none by default", () => {
    render(
      <div>
        <Link href="/a" size="sm">small</Link>
        <Link href="/b">plainest</Link>
      </div>,
    );
    expect(screen.getByRole("link", { name: "small" }).className).toContain("size-sm");
    expect(screen.getByRole("link", { name: "plainest" }).className).not.toContain("size-");
  });

  it("as button gets type=button so forms stay unsubmitted", () => {
    render(<Link as="button" onClick={() => {}}>act</Link>);
    expect(screen.getByRole("button", { name: "act" })).toHaveAttribute("type", "button");
  });

  it("as button respects an explicit type", () => {
    render(<Link as="button" type="submit">send</Link>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  // jsdom computes no real styles, so the stylesheet itself is the fixture:
  // a native button carries UA chrome that the sheet must strip, or an
  // as="button" link renders as a grey pill instead of link text.
  it("strips native button chrome for as=button", () => {
    const reset = sheet.match(/button\.link\s*\{[^}]*\}/)?.[0];
    expect(reset).toBeDefined();
    for (const decl of ["border: none", "background: none", "padding: 0", "font: inherit", "cursor: pointer"]) {
      expect(reset).toContain(decl);
    }
  });

  it("has no axe violations", async () => {
    const { container } = render(<Link href="/a">go</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
