import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link, Text } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Link",
  component: Link,
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: () => (
    <Text>
      Read the <Link href="#">full guide</Link> before starting.
    </Text>
  ),
};
export const Standalone: Story = {
  args: { variant: "standalone", href: "#", children: "View all sessions" },
};
export const External: Story = {
  args: { external: true, href: "https://example.com", children: "Opens in new tab" },
};
