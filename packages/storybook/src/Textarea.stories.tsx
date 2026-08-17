import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Notes", placeholder: "Notes…" },
};

export const CharacterLimit: Story = {
  args: { "aria-label": "Bio", maxLength: 120, showCount: true, placeholder: "Tell us about yourself…" },
};
