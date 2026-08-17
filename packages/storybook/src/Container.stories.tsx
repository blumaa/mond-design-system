import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Layout/Container",
  component: Container,
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Widths: Story = {
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
