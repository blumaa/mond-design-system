import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading, Stack } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <Stack>
      <Heading level={1}>Level 1 — display</Heading>
      <Heading level={2}>Level 2 — title</Heading>
      <Heading level={3}>Level 3 — subtitle</Heading>
      <Heading level={4}>Level 4 — subtitle</Heading>
    </Stack>
  ),
};
export const VariantOverride: Story = {
  args: { level: 2, variant: "display", children: "h2 outline, display size" },
};

/** A rail's own title: still an h2 in the outline, sized so it does not
 * compete with the page heading beside it. */
export const LabelSized: Story = {
  args: { level: 2, variant: "label", children: "Chapters" },
};
