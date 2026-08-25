import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Stack, Text } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Stack",
  component: Stack,
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Gaps: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="section">
      {(["hairline", "tight", "base", "loose", "group", "section"] as const).map((gap) => (
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

/** The cross axis. A Stack flows down, so align says where a child sits from
 * left to right — the answer to "centre this one thing", which is a Stack's
 * job and not a Container's. stretch is the default: a child with no width of
 * its own takes the column's. */
export const Alignment: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="section">
      {(["start", "center", "end", "stretch"] as const).map((align) => (
        <Stack key={align} gap="tight">
          <Text tone="muted">align="{align}"</Text>
          <Stack gap="tight" align={align} className={story.bounds}>
            <Badge>one</Badge>
            <Badge tone="accent">a longer one</Badge>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};
