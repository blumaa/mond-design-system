import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, Inline, Skeleton, Stack } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Stack gap="base" className={story.frame}>
      <Skeleton />
      <Skeleton variant="rect" height="4rem" />
      <Skeleton variant="circle" />
    </Stack>
  ),
};

/** A paragraph's worth of lines, the last one short. */
export const Lines: Story = {
  render: () => (
    <div className={story.frame}>
      <Skeleton lines={3} />
    </div>
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
          <Stack gap="tight" className={story.fill}>
            <Skeleton width="70%" />
            <Skeleton width="45%" />
          </Stack>
        </Inline>
      </CardBody>
    </Card>
  ),
};
