import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Inline, Stack, Text } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Inline",
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

/** Inline is Stack turned on its side, so the two axes swap jobs: justify
 * distributes along the row, align places a child across it. The row is drawn
 * because both are questions about the space left over, not about the chips. */
export const Alignment: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="section">
      <Stack gap="tight">
        <Text tone="muted">justify — along the row</Text>
        {(["start", "center", "end", "between"] as const).map((justify) => (
          <Inline key={justify} gap="tight" justify={justify} className={story.bounds}>
            <Badge>{justify}</Badge>
            <Badge tone="accent">two</Badge>
          </Inline>
        ))}
      </Stack>

      <Stack gap="tight">
        <Text tone="muted">align — across it, on children of unequal height</Text>
        {(["start", "center", "end", "baseline"] as const).map((align) => (
          <Inline key={align} gap="tight" align={align} className={story.bounds}>
            <Text variant="meta">{align}</Text>
            <Badge>badge</Badge>
            <Button size="lg">Tall</Button>
          </Inline>
        ))}
      </Stack>

      <Stack gap="tight">
        <Text tone="muted">wrap — onto a new line when the row runs out</Text>
        {/* Held to the app's own column, or there is nothing to run out of. */}
        <Inline gap="tight" wrap className={`${story.bounds} ${story.frame}`}>
          {Array.from({ length: 14 }, (_, i) => (
            <Badge key={i}>chip {i + 1}</Badge>
          ))}
        </Inline>
      </Stack>
    </Stack>
  ),
};
