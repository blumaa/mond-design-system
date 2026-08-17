import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, EmptyState, Icon } from "@mond-design-system/react";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Nothing here yet",
    description: "Items you add will show up in this list.",
    icon: <Icon name="star" size="lg" />,
    action: <Button>Add the first one</Button>,
  },
};
