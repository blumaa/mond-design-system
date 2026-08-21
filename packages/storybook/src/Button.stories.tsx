import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Icon, Inline } from "@mond-design-system/react";
import story from "./story.module.css";

const meta = {
  title: "Atoms/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: "Save changes" } };
export const Variants: Story = {
  render: () => (
    <Inline gap="base" wrap>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Inline>
  ),
};
export const Sizes: Story = {
  render: () => (
    <Inline gap="base" align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
  ),
};
export const WithIcons: Story = {
  render: () => (
    <Inline gap="base">
      <Button iconLeft={<Icon name="search" />}>Search</Button>
      <Button variant="secondary" iconRight={<Icon name="arrow-right" />}>
        Continue
      </Button>
    </Inline>
  ),
};
export const IconOnly: Story = {
  render: () => (
    <Inline gap="base" align="center">
      <Button iconOnly aria-label="Search" variant="ghost">
        <Icon name="search" />
      </Button>
      <Button iconOnly aria-label="Confirm" variant="primary">
        <Icon name="check" />
      </Button>
      <Button iconOnly aria-label="Delete" variant="danger">
        <Icon name="close" />
      </Button>
    </Inline>
  ),
};
/** The default shape follows the size, and `shape` overrides it either way. */
export const Shapes: Story = {
  render: () => (
    <Inline gap="base" align="center">
      <Button shape="pill">Follow</Button>
      <Button iconOnly aria-label="Search" variant="ghost" shape="rect">
        <Icon name="search" />
      </Button>
    </Inline>
  ),
};
/** On a picture, the two see-through variants swap the page's foreground for
 *  the on-media one. The filled variants bring their own ground and are left
 *  alone. */
export const OnMedia: Story = {
  render: () => (
    <div className={story.photo}>
      <Inline gap="base" align="center">
        <Button variant="ghost" onMedia>
          Show
        </Button>
        <Button variant="secondary" onMedia>
          Save
        </Button>
        <Button variant="secondary" onMedia disabled>
          Saved
        </Button>
        <Button iconOnly aria-label="Close" variant="ghost" onMedia>
          <Icon name="close" />
        </Button>
      </Inline>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <Inline gap="base">
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </Inline>
  ),
};
export const AsLink: Story = { args: { href: "#", children: "Go somewhere" } };
