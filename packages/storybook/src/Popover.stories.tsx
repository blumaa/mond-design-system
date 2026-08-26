import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Chip,
  ChipGroup,
  Field,
  Inline,
  Input,
  Popover,
  PopoverBody,
  PopoverFooter,
  PopoverHeader,
  Select,
  Stack,
  Text,
  type PopoverPlacement,
} from "@mond-design-system/react";

const meta = {
  title: "Organisms/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const args = {
  open: false,
  onClose: () => {},
  anchorRef: { current: null },
  label: "",
  children: null,
};

/** The everyday shape: a trigger holding the open state, a panel hanging off it. */
export const Default: Story = {
  args,
  render: function Render() {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          Details
        </Button>
        <Popover
          open={open}
          onClose={() => setOpen(false)}
          anchorRef={anchor}
          label="Heat details"
        >
          <PopoverBody>
            <Text>
              Non-modal: the page behind stays live and keeps scrolling, and the panel travels
              with the trigger. Escape, a press outside, or the trigger again closes it.
            </Text>
          </PopoverBody>
        </Popover>
      </>
    );
  },
};

/** Header, body and footer, the same three slots a Modal and a Sheet have. */
export const Composed: Story = {
  args,
  render: function Render() {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          Equipment
        </Button>
        <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchor} label="Equipment">
          <PopoverHeader onClose={() => setOpen(false)} closeLabel="Close equipment">
            Equipment
          </PopoverHeader>
          <PopoverBody>
            <Stack gap="base">
              <ChipGroup>
                <Chip>Barbell</Chip>
                <Chip>20kg plates</Chip>
                <Chip>Rower</Chip>
              </ChipGroup>
              <Field label="Add item">
                <Input placeholder="e.g. Kettlebell, 24kg" />
              </Field>
              <Field label="Division">
                <Select defaultValue="">
                  <option value="">All divisions</option>
                  <option value="rx">RX</option>
                  <option value="scaled">Scaled</option>
                </Select>
              </Field>
            </Stack>
          </PopoverBody>
          <PopoverFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Add</Button>
          </PopoverFooter>
        </Popover>
      </>
    );
  },
};

const PLACEMENTS: PopoverPlacement[] = ["top", "bottom", "left", "right"];

/** Each one flips to the opposite side when that side runs out of room —
    scroll the frame or narrow the window and watch them turn over. */
export const Placement: Story = {
  args,
  render: function Render() {
    return (
      <Inline gap="base">
        {PLACEMENTS.map((placement) => (
          <PlacedExample key={placement} placement={placement} />
        ))}
      </Inline>
    );
  },
};

function PlacedExample({ placement }: { placement: PopoverPlacement }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {placement}
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchor}
        label={`Placed ${placement}`}
        placement={placement}
      >
        <PopoverBody>
          <Text>Asked for {placement}.</Text>
        </PopoverBody>
      </Popover>
    </>
  );
}

/** Long content is capped to the room the viewport has left and scrolls inside
    the panel; the header and footer stay put. */
export const Scrolling: Story = {
  args,
  render: function Render() {
    const anchor = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button ref={anchor} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          Athletes
        </Button>
        <Popover open={open} onClose={() => setOpen(false)} anchorRef={anchor} label="Athletes">
          <PopoverHeader>Athletes</PopoverHeader>
          <PopoverBody>
            <Stack gap="tight">
              {Array.from({ length: 30 }, (_, i) => (
                <Text key={i}>Lane {i + 1}</Text>
              ))}
            </Stack>
          </PopoverBody>
        </Popover>
      </>
    );
  },
};
