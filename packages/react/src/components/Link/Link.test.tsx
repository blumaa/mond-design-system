// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Link } from "./Link";

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

  it("has no axe violations", async () => {
    const { container } = render(<Link href="/a">go</Link>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
