import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Inline, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Layout/Inline",
  component: Inline,
} satisfies Meta<typeof Inline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="loose">
      <Inline gap="tight">
        <Badge>wrapped</Badge>
        <Badge tone="accent">chips</Badge>
        <Badge tone="success">in a row</Badge>
      </Inline>
      <Inline justify="between">
        <Text>Left side</Text>
        <Button size="sm">Action</Button>
      </Inline>
    </Stack>
  ),
};
