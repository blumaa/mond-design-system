import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppBar,
  Button,
  Icon,
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
  // Screen fills its host rather than claiming the viewport (the host owns
  // the real height — see Screen.tsx). Storybook's root has no height, so
  // the story plays the host.
  decorators: [(Story) => <div style={{ height: "100dvh" }}><Story /></div>],
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
          <Button iconOnly aria-label="Back" variant="ghost">
            <Icon name="arrow-right" />
          </Button>
        }
        trailing={
          <Button iconOnly aria-label="Search" variant="ghost">
            <Icon name="search" />
          </Button>
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
