import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, TabBar, TabBarItem } from "@mond-design-system/react";

const meta = {
  title: "Organisms/TabBar",
  component: TabBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Primary", children: null },
  render: () => (
    <TabBar label="Primary">
      <TabBarItem href="#home" label="Home" icon={<Icon name="star" />} active />
      <TabBarItem href="#search" label="Search" icon={<Icon name="search" />} />
      <TabBarItem href="#done" label="Done" icon={<Icon name="check" />} />
    </TabBar>
  ),
};

/** `hideLabel` takes the caption off the screen and leaves it in the item's
    accessible name — for a bar whose glyphs carry the meaning, and whose
    captions would wrap once translated. */
export const IconsOnly: Story = {
  args: { label: "Primary", children: null },
  render: () => (
    <TabBar label="Primary">
      <TabBarItem href="#home" label="Home" icon={<Icon name="star" />} hideLabel active />
      <TabBarItem href="#search" label="Search" icon={<Icon name="search" />} hideLabel />
      <TabBarItem href="#done" label="Done" icon={<Icon name="check" />} hideLabel />
    </TabBar>
  ),
};
