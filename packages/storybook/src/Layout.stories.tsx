import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Button, Container, Inline, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Layout/Primitives",
  component: Stack,
} satisfies Meta<typeof Stack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StackGaps: Story = {
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

export const InlineRow: Story = {
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

export const ContainerWidths: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="loose">
      <Container>
        <Text>Content width — reading measure, forms, detail pages.</Text>
      </Container>
      <Container width="wide">
        <Text>Wide width — dashboards, tables, galleries.</Text>
      </Container>
    </Stack>
  ),
};
