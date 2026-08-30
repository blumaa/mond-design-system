// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

function Example({ onChange = () => {} }: { onChange?: (v: string) => void }) {
  return (
    <Tabs value="a" onChange={onChange}>
      <TabList label="Sections">
        <Tab value="a">Alpha</Tab>
        <Tab value="b">Beta</Tab>
      </TabList>
      <TabPanel value="a">Alpha content</TabPanel>
      <TabPanel value="b">Beta content</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("exposes tablist/tab/tabpanel wiring", () => {
    render(<Example />);
    expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    expect(alpha).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Alpha content");
    expect(alpha).toHaveAttribute("aria-controls", panel.id);
  });

  it("hides the unselected panel", () => {
    render(<Example />);
    expect(screen.queryByText("Beta content")).not.toBeVisible();
  });

  it("click selects", async () => {
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Beta" }));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("arrow keys move selection", async () => {
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    screen.getByRole("tab", { name: "Alpha" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("only the active tab is tabbable", () => {
    render(<Example />);
    expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("tabindex", "-1");
  });

  /* APG: the panel takes tabindex="0" so a panel of plain text is still the
     next stop after the strip — otherwise Tab skips past everything the
     selected tab just promised. */
  it("the shown panel itself is a tab stop", () => {
    render(<Example />);
    expect(screen.getByRole("tabpanel")).toHaveAttribute("tabindex", "0");
  });

  // The strip is also a filter over one shared region (reaction lists, feeds) —
  // there is no panel per tab. A tab must not claim a panel that does not exist.
  it("omits aria-controls when no panel carries the tab's value", () => {
    render(
      <Tabs value="a" onChange={() => {}}>
        <TabList label="Filter">
          <Tab value="a">All</Tab>
          <Tab value="b">Some</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "All" })).not.toHaveAttribute("aria-controls");
    expect(screen.getByRole("tab", { name: "Some" })).not.toHaveAttribute("aria-controls");
  });

  it("has no axe violations as a panel-less strip", async () => {
    const { container } = render(
      <Tabs value="a" onChange={() => {}}>
        <TabList label="Filter">
          <Tab value="a">All</Tab>
          <Tab value="b">Some</Tab>
        </TabList>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("drops aria-controls again when its panel unmounts", () => {
    const { rerender } = render(
      <Tabs value="a" onChange={() => {}}>
        <TabList label="Sections">
          <Tab value="a">Alpha</Tab>
        </TabList>
        <TabPanel value="a">Alpha content</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole("tab")).toHaveAttribute("aria-controls");
    rerender(
      <Tabs value="a" onChange={() => {}}>
        <TabList label="Sections">
          <Tab value="a">Alpha</Tab>
        </TabList>
      </Tabs>,
    );
    expect(screen.getByRole("tab")).not.toHaveAttribute("aria-controls");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
