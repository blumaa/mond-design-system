import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "@mond-design-system/react";

const meta = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = { args: { value: 40, label: "Upload" } };
export const Indeterminate: Story = { args: { indeterminate: true, label: "Loading" } };
