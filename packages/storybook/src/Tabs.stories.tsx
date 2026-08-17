import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, Tabs, Text } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: "overview", onChange: () => {}, children: null },
  render: function Render() {
    const [tab, setTab] = useState("overview");
    return (
      <Tabs value={tab} onChange={setTab}>
        <TabList label="Sections">
          <Tab value="overview">Overview</Tab>
          <Tab value="activity">Activity</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanel value="overview">
          <Text>Overview content.</Text>
        </TabPanel>
        <TabPanel value="activity">
          <Text>Activity content.</Text>
        </TabPanel>
        <TabPanel value="settings">
          <Text>Settings content.</Text>
        </TabPanel>
      </Tabs>
    );
  },
};
