import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Layout/Stack",
  component: Stack,
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Gaps: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="section">
      {(["hairline", "tight", "base", "loose"] as const).map((gap) => (
        <Stack key={gap} gap={gap}>
          <Text tone="muted">gap="{gap}"</Text>
          <Badge>one</Badge>
          <Badge>two</Badge>
          <Badge>three</Badge>
        </Stack>
      ))}
    </Stack>
  ),
};
