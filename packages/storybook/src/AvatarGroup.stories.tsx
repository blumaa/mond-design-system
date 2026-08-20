import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarGroup } from "@mond-design-system/react";

const meta = {
  title: "Molecules/AvatarGroup",
  component: AvatarGroup,
} satisfies Meta<typeof AvatarGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Edsger Dijkstra", "Barbara Liskov"];
const avatars = (count: number) => people.slice(0, count).map((name) => <Avatar key={name} name={name} />);

export const Default: Story = { args: { children: avatars(3) } };

/** Past `max`, the rest collapse into one chip. */
export const Overflow: Story = { args: { max: 3, children: avatars(5) } };

/** The chip sizes with the avatars it stands in for. */
export const Sizes: Story = {
  args: { children: avatars(5) },
  render: () => (
    <AvatarGroup max={2} size="lg">
      {people.slice(0, 4).map((name) => (
        <Avatar key={name} name={name} size="lg" />
      ))}
    </AvatarGroup>
  ),
};
