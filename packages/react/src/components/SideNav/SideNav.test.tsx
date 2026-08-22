// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SideNav, SideNavGroup, SideNavItem } from "./SideNav";

describe("SideNav", () => {
  it("is a labelled navigation with links", () => {
    render(
      <SideNav label="Primary">
        <SideNavItem href="/home" label="Home" icon={<svg />} active />
        <SideNavItem href="/library" label="Library" icon={<svg />} />
      </SideNav>,
    );
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Library" })).not.toHaveAttribute("aria-current");
  });

  /* Signing out goes nowhere — a row that does not navigate is a button. */
  it("a row with no destination is a button, and fires onClick", async () => {
    const onClick = vi.fn();
    render(
      <SideNav label="Primary">
        <SideNavItem label="Sign out" icon={<svg />} onClick={onClick} />
      </SideNav>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  /* A standing navigation in a client-routed app is where a full page reload
     costs the most: the shell restarts under it. */
  it("as renders the router's link, keeping href and the active mark", () => {
    const Fake = (props: React.ComponentProps<"a">) => <a data-testid="fake" {...props} />;
    render(
      <SideNav label="Primary">
        <SideNavItem as={Fake} label="Home" icon={<svg />} href="/" active />
      </SideNav>,
    );
    const link = screen.getByTestId("fake");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("a group is named by its heading, so its rows are read as one run", () => {
    render(
      <SideNav label="Primary">
        <SideNavGroup label="More">
          <SideNavItem href="/settings" label="Settings" icon={<svg />} />
        </SideNavGroup>
      </SideNav>,
    );
    const group = screen.getByRole("group", { name: "More" });
    expect(group).toContainElement(screen.getByRole("link", { name: "Settings" }));
  });

  /* Rows still need to sit in a run when the run has no name — a group with no
     heading groups nothing a reader would be told about. */
  it("a group with no heading names nothing", () => {
    render(
      <SideNav label="Primary">
        <SideNavGroup>
          <SideNavItem href="/" label="Home" icon={<svg />} />
        </SideNavGroup>
      </SideNav>,
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("counts what is waiting, in words as well as digits", () => {
    render(
      <SideNav label="Primary">
        <SideNavItem
          href="/notifications"
          label="Notifications"
          icon={<svg />}
          count={3}
          countLabel="3 unread notifications"
        />
      </SideNav>,
    );
    expect(screen.getByRole("status", { name: "3 unread notifications" })).toHaveTextContent("3");
  });

  /* An absence needs no mark, and the column has a fixed width: a four-digit
     count would push the word out of it. */
  it("draws no count at zero, and caps the ones it draws", () => {
    render(
      <SideNav label="Primary">
        <SideNavItem href="/a" label="Quiet" icon={<svg />} count={0} countLabel="nothing" />
        <SideNavItem href="/b" label="Loud" icon={<svg />} count={140} countLabel="140 unread" />
      </SideNav>,
    );
    expect(screen.queryByRole("status", { name: "nothing" })).not.toBeInTheDocument();
    expect(screen.getByRole("status", { name: "140 unread" })).toHaveTextContent("99+");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SideNav label="Primary">
        <SideNavItem href="/" label="Home" icon={<svg />} active />
        <SideNavGroup label="More">
          <SideNavItem
            href="/notifications"
            label="Notifications"
            icon={<svg />}
            count={3}
            countLabel="3 unread notifications"
          />
          <SideNavItem label="Sign out" icon={<svg />} onClick={() => {}} />
        </SideNavGroup>
      </SideNav>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
