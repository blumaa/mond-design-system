import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Divider, Icon, SideNav, SideNavGroup, SideNavItem } from "@mond-design-system/react";

const meta = {
  title: "Organisms/SideNav",
  component: SideNav,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SideNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Primary", children: null },
  render: () => (
    <SideNav label="Primary">
      <SideNavItem href="#home" label="Home" icon={<Icon name="star" />} active />
      <SideNavItem href="#search" label="Search" icon={<Icon name="search" />} />
      <SideNavItem href="#done" label="Done" icon={<Icon name="check" />} />
    </SideNav>
  ),
};

/** Groups name a run of destinations, and a rule separates one run from the
    next. The count sits at the far end of the row it belongs to; the word it
    is counted in is what a screen reader reads. */
export const Grouped: Story = {
  args: { label: "Primary", children: null },
  render: () => (
    <SideNav label="Primary">
      <SideNavItem href="#home" label="Home" icon={<Icon name="star" />} active />
      <SideNavItem href="#search" label="Search" icon={<Icon name="search" />} />
      <Divider />
      <SideNavGroup label="More">
        <SideNavItem
          href="#alerts"
          label="Notifications"
          icon={<Icon name="check" />}
          count={3}
          countLabel="3 unread notifications"
        />
        <SideNavItem label="Sign out" icon={<Icon name="close" />} onClick={() => {}} />
      </SideNavGroup>
      <Button fullWidth iconLeft={<Icon name="arrow-right" />}>
        New post
      </Button>
    </SideNav>
  ),
};
