import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Icon } from "@mond-design-system/react";

const meta = {
  title: "Atoms/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: "Save changes" } };
export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button iconLeft={<Icon name="search" />}>Search</Button>
      <Button variant="secondary" iconRight={<Icon name="arrow-right" />}>
        Continue
      </Button>
    </div>
  ),
};
export const IconOnly: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button iconOnly aria-label="Search" variant="ghost">
        <Icon name="search" />
      </Button>
      <Button iconOnly aria-label="Confirm" variant="primary">
        <Icon name="check" />
      </Button>
      <Button iconOnly aria-label="Delete" variant="danger">
        <Icon name="close" />
      </Button>
    </div>
  ),
};
export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </div>
  ),
};
export const AsLink: Story = { args: { href: "#", children: "Go somewhere" } };
