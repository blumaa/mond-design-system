import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CardBody,
  Inline,
  Menu,
  MenuItem,
  Stack,
  Text,
  type MenuPlacement,
} from "@mond-design-system/react";

const meta = {
  title: "Organisms/Menu",
  component: Menu,
} satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;

const args = { label: "", trigger: <Button>Actions</Button>, children: null };

/** Click, or focus the trigger and press ArrowDown. Arrows move, Enter
    chooses, Escape and Tab close and hand focus back. */
export const Default: Story = {
  args,
  render: function Render() {
    const [last, setLast] = useState("nothing yet");
    return (
      <Stack gap="base" align="start">
        <Menu label="Heat actions" trigger={<Button variant="secondary">Actions</Button>}>
          <MenuItem onSelect={() => setLast("Edit heat")}>Edit heat</MenuItem>
          <MenuItem onSelect={() => setLast("Duplicate")}>Duplicate</MenuItem>
          <MenuItem onSelect={() => setLast("Export CSV")}>Export CSV</MenuItem>
        </Menu>
        <Text tone="secondary">Chose: {last}</Text>
      </Stack>
    );
  },
};

/** A destructive action reads as one, and an item that is not available right
    now stays in the list rather than disappearing — the arrow keys skip it. */
export const TonesAndDisabled: Story = {
  args,
  render: function Render() {
    return (
      <Menu label="Athlete actions" trigger={<Button variant="secondary">Athlete</Button>}>
        <MenuItem onSelect={() => {}}>Edit athlete</MenuItem>
        <MenuItem onSelect={() => {}} disabled>
          Move to heat 4 (full)
        </MenuItem>
        <MenuItem onSelect={() => {}} tone="danger">
          Withdraw from event
        </MenuItem>
      </Menu>
    );
  },
};

const PLACEMENTS: MenuPlacement[] = ["bottom-start", "bottom-end", "top-start", "top-end"];

/** Default is bottom-end, so a menu on a row's right-hand action button opens
    back under the button rather than off the edge. */
export const Placement: Story = {
  args,
  render: function Render() {
    return (
      <Inline gap="base">
        {PLACEMENTS.map((placement) => (
          <Menu
            key={placement}
            label={`Placed ${placement}`}
            placement={placement}
            trigger={<Button variant="secondary">{placement}</Button>}
          >
            <MenuItem onSelect={() => {}}>First</MenuItem>
            <MenuItem onSelect={() => {}}>Second</MenuItem>
          </Menu>
        ))}
      </Inline>
    );
  },
};

/** Where it earns its keep: one overflow button per row, same menu each time. */
export const InARow: Story = {
  args,
  render: function Render() {
    const heats = ["Heat 1 — 09:00", "Heat 2 — 09:12", "Heat 3 — 09:24"];
    return (
      <Stack gap="tight">
        {heats.map((heat) => (
          <Card key={heat}>
            <CardBody>
              <Inline justify="between" align="center">
                <Text>{heat}</Text>
                <Menu
                  label={`${heat} actions`}
                  trigger={
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  }
                >
                  <MenuItem onSelect={() => {}}>Edit</MenuItem>
                  <MenuItem onSelect={() => {}}>Duplicate</MenuItem>
                  <MenuItem onSelect={() => {}} tone="danger">
                    Delete
                  </MenuItem>
                </Menu>
              </Inline>
            </CardBody>
          </Card>
        ))}
      </Stack>
    );
  },
};
