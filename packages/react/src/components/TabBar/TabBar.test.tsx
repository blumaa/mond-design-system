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

  /* A tab bar in a client-routed app is the one place a full page reload is
     most expensive: the shell restarts on every tap. The router's Link is the
     element that stops it, and only the app knows which router it has. */
  it("as renders the router's link, keeping href and the active mark", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(
      <TabBar label="Primary">
        <TabBarItem as={Fake} label="Home" icon={<span />} href="/" active />
      </TabBar>,
    );
    const link = screen.getByTestId("fake");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("aria-current", "page");
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

  /* A bar of four glyphs on the narrowest phone has no room for a caption
     under each one, and a translation twice the length of the English is what
     turns the row into two. Hiding the word is a layout decision; deleting it
     would take the item's accessible name with it. */
  describe("hideLabel", () => {
    it("keeps the caption out of sight and in the accessible name", () => {
      render(
        <TabBar label="Primary">
          <TabBarItem href="/library" label="Library" icon={<svg />} hideLabel />
        </TabBar>,
      );
      expect(screen.getByRole("link", { name: "Library" })).toBeInTheDocument();
      expect(screen.getByText("Library").className).toMatch(/hidden/);
    });

    it("draws the caption when nothing asks it not to", () => {
      render(
        <TabBar label="Primary">
          <TabBarItem href="/library" label="Library" icon={<svg />} />
        </TabBar>,
      );
      expect(screen.getByText("Library").className).toMatch(/label/);
    });

    it("hides the caption on a bar item that is a button too", () => {
      render(
        <TabBar label="Primary">
          <TabBarItem label="More" icon={<svg />} onClick={() => {}} hideLabel />
        </TabBar>,
      );
      expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
      expect(screen.getByText("More").className).toMatch(/hidden/);
    });
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
