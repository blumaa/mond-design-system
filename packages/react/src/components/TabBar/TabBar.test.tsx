// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { TabBar, TabBarAction, TabBarItem } from "./TabBar";

describe("TabBar", () => {
  it("is a labelled navigation with links", () => {
    render(
      <TabBar label="Primary">
        <TabBarItem href="/home" label="Home" icon={<span />} active />
        <TabBarItem href="/search" label="Search" icon={<span />} />
      </TabBar>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
  });

  it("button items fire onClick", async () => {
    const onClick = vi.fn();
    render(
      <TabBar label="Primary">
        <TabBarItem label="More" icon={<span />} onClick={onClick} />
      </TabBar>,
    );
    await userEvent.click(screen.getByRole("button", { name: "More" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("badge renders a dot on the icon, none by default", () => {
    render(
      <TabBar label="Primary">
        <TabBarItem label="Messages" icon={<svg />} href="/m" badge />
        <TabBarItem label="Home" icon={<svg />} href="/" />
      </TabBar>,
    );
    expect(screen.getAllByTestId("mds-tabbar-badge")).toHaveLength(1);
  });

  it("center action is an icon-only button named by its label", async () => {
    const onClick = vi.fn();
    render(
      <TabBar label="Primary">
        <TabBarItem label="Home" icon={<svg />} href="/" active />
        <TabBarAction label="Create" icon={<svg />} onClick={onClick} />
        <TabBarItem label="Search" icon={<svg />} href="/search" />
      </TabBar>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TabBar label="Primary">
        <TabBarItem href="/home" label="Home" icon={<span />} active />
        <TabBarItem href="/search" label="Search" icon={<span />} />
      </TabBar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
