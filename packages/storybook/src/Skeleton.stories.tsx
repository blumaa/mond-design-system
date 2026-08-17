import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CardShape: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", width: "16rem" }}>
      <Skeleton variant="rect" height="8rem" />
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Skeleton variant="circle" />
        <div style={{ display: "grid", gap: "0.5rem", flex: 1 }}>
          <Skeleton width="70%" />
          <Skeleton width="45%" />
        </div>
      </div>
    </div>
  ),
};
