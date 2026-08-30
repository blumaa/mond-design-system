// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type { AnchorHTMLAttributes } from "react";
import { Breadcrumb } from "./Breadcrumb";

const trail = [
  { label: "Library", href: "/library" },
  { label: "Omote Ura", href: "/library/omote-ura" },
  { label: "Kihon" },
];

/* Stands in for a router's Link, which takes the same props and adds its own. */
function RouterLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a data-router="" {...props} />;
}

describe("Breadcrumb", () => {
  it("is a navigation landmark, named by the caller", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("renders the whole trail", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    for (const { label } of trail) expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("links every step above the one you are on", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(screen.getByRole("link", { name: "Library" })).toHaveAttribute("href", "/library");
    expect(screen.getByRole("link", { name: "Omote Ura" })).toBeInTheDocument();
  });

  it("underlines the links, so color is not the only thing separating them from the last step", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(screen.getByRole("link", { name: "Library" }).className).toContain("variant-inline");
  });

  it("leaves the last step as text, since it is where you already are", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(screen.queryByRole("link", { name: "Kihon" })).not.toBeInTheDocument();
    expect(screen.getByText("Kihon")).toHaveAttribute("aria-current", "page");
  });

  it("does not link a step with no href, wherever it sits", () => {
    render(<Breadcrumb items={[{ label: "Library" }, { label: "Kihon" }]} label="Breadcrumb" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("is a list, so a screen reader says how many steps there are", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("hides the separators from anyone listening", () => {
    const { container } = render(<Breadcrumb items={trail} label="Breadcrumb" />);
    const separators = container.querySelectorAll("svg");
    expect(separators).toHaveLength(2);
    for (const separator of separators) expect(separator).toHaveAttribute("aria-hidden", "true");
  });

  it("renders nothing when there is no trail", () => {
    const { container } = render(<Breadcrumb items={[]} label="Breadcrumb" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders each link with the element it is given", () => {
    render(<Breadcrumb items={trail} label="Breadcrumb" linkAs={RouterLink} />);
    expect(screen.getByRole("link", { name: "Library" })).toHaveAttribute("data-router");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Breadcrumb items={trail} label="Breadcrumb" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
