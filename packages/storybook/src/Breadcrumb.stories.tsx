import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Breadcrumb",
    items: [
      { label: "Library", href: "#" },
      { label: "Omote Ura", href: "#" },
      { label: "Kihon" },
    ],
  },
};

/** One step above the root is still a trail. */
export const OneStep: Story = {
  args: { label: "Breadcrumb", items: [{ label: "Library", href: "#" }, { label: "Kihon" }] },
};

/** A step with no href is text, wherever it sits. */
export const Unlinked: Story = {
  args: {
    label: "Breadcrumb",
    items: [{ label: "Library", href: "#" }, { label: "Omote Ura" }, { label: "Kihon" }],
  },
};
