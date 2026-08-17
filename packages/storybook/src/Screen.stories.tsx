import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppBar,
  Icon,
  IconButton,
  Screen,
  ScreenContent,
  Stack,
  TabBar,
  TabBarItem,
  Text,
} from "@mond-design-system/react";

const meta = {
  title: "Templates/Screen",
  component: Screen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Screen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AppShell: Story = {
  args: { children: null },
  render: () => (
    <Screen>
      <AppBar
        title="Sessions"
        leading={
          <IconButton label="Back">
            <Icon name="arrow-right" />
          </IconButton>
        }
        trailing={
          <IconButton label="Search">
            <Icon name="search" />
          </IconButton>
        }
      />
      <ScreenContent>
        <Stack gap="base">
          <Text>Scrollable main region between the bars.</Text>
          <Text tone="muted">AppBar is sticky top; TabBar is sticky bottom.</Text>
        </Stack>
      </ScreenContent>
      <TabBar label="Primary">
        <TabBarItem href="#home" label="Home" icon={<Icon name="star" />} active />
        <TabBarItem href="#search" label="Search" icon={<Icon name="search" />} />
        <TabBarItem href="#done" label="Done" icon={<Icon name="check" />} />
      </TabBar>
    </Screen>
  ),
};
