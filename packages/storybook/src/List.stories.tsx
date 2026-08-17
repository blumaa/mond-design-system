import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Badge, Icon, ListGroup, ListItem } from "@mond-design-system/react";

const meta = {
  title: "Molecules/List",
  component: ListGroup,
} satisfies Meta<typeof ListGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Mixed: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: "22rem" }}>
      <ListGroup>
        <ListItem
          title="Ada Lovelace"
          description="Last seen today"
          leading={<Avatar name="Ada Lovelace" />}
          trailing={<Badge tone="success">online</Badge>}
        />
        <ListItem
          title="Open settings"
          description="Row as button"
          onClick={() => {}}
          trailing={<Icon name="arrow-right" />}
        />
        <ListItem title="Documentation" description="Row as link" href="#" trailing={<Icon name="arrow-right" />} />
      </ListGroup>
    </div>
  ),
};
