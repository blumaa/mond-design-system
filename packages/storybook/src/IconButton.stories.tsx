import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, IconButton } from "@mond-design-system/react";

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: { label: "Close", children: <Icon name="close" /> },
};
export const Variants: Story = {
  args: { label: "Search", children: null },
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <IconButton label="Search" variant="ghost">
        <Icon name="search" />
      </IconButton>
      <IconButton label="Confirm" variant="primary">
        <Icon name="check" />
      </IconButton>
      <IconButton label="Delete" variant="danger">
        <Icon name="close" />
      </IconButton>
    </div>
  ),
};
