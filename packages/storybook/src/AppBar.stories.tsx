import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppBar, Button, Icon } from "@mond-design-system/react";

const meta = {
  title: "Molecules/AppBar",
  component: AppBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithSlots: Story = {
  args: { title: "Sessions" },
  render: () => (
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
  ),
};
