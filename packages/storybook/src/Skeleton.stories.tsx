import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, Inline, Skeleton, Stack } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Stack gap="base" style={{ width: "16rem" }}>
      <Skeleton />
      <Skeleton variant="rect" height="4rem" />
      <Skeleton variant="circle" />
    </Stack>
  ),
};

/** What a Card looks like while its content loads. */
export const LoadingCardExample: Story = {
  name: "Loading card (example)",
  render: () => (
    <Card>
      <Skeleton variant="rect" height="8rem" />
      <CardBody>
        <Inline gap="tight" align="center">
          <Skeleton variant="circle" />
          <Stack gap="tight" style={{ flex: 1 }}>
            <Skeleton width="70%" />
            <Skeleton width="45%" />
          </Stack>
        </Inline>
      </CardBody>
    </Card>
  ),
};
