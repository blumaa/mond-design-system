import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Levels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Heading level={1}>Level 1 — display</Heading>
      <Heading level={2}>Level 2 — title</Heading>
      <Heading level={3}>Level 3 — subtitle</Heading>
      <Heading level={4}>Level 4 — subtitle</Heading>
    </div>
  ),
};
export const VariantOverride: Story = {
  args: { level: 2, variant: "display", children: "h2 outline, display size" },
};
