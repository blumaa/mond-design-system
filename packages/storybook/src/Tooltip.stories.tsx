import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Icon, Inline, Text, Tooltip, type TooltipPlacement } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

/* Stories that draw themselves still have to satisfy the component's args,
   and a tooltip has no meaning without the control it labels. */
const placeholder = { content: "", children: <Button>Trigger</Button> };

/** Hover and hold, or Tab to it. Escape puts it away without moving either. */
export const Default: Story = {
  args: {
    content: "Remove from heat",
    children: (
      <Button variant="secondary" aria-label="Remove from heat">
        Remove
      </Button>
    ),
  },
};

/** The case it is actually for: a control that shows only its glyph. The
    aria-label is the name, the tooltip is the description — a control still
    needs its own name for anyone who never sees the tooltip. */
export const IconOnly: Story = {
  args: placeholder,
  render: function Render() {
    return (
      <Tooltip content="Star this heat">
        <Button variant="ghost" aria-label="Star this heat" iconOnly>
          <Icon name="star" />
        </Button>
      </Tooltip>
    );
  },
};

/** No dwell at all — for a dense row of glyph buttons where the reader is
    already scanning. */
export const NoDelay: Story = {
  args: {
    content: "Shows the moment you arrive",
    delayMs: 0,
    children: <Button variant="secondary">Instant</Button>,
  },
};

const PLACEMENTS: TooltipPlacement[] = ["top", "bottom", "left", "right"];

/** Each flips to the opposite side when that side runs out of room. */
export const Placement: Story = {
  args: placeholder,
  render: function Render() {
    return (
      <Inline gap="base">
        {PLACEMENTS.map((placement) => (
          <Tooltip key={placement} content={`Placed ${placement}`} placement={placement} delayMs={0}>
            <Button variant="secondary">{placement}</Button>
          </Tooltip>
        ))}
      </Inline>
    );
  },
};

/** Past a couple of lines the text belongs in the thing it describes, so the
    surface is capped and the words wrap rather than stretching off the screen. */
export const LongLabel: Story = {
  args: placeholder,
  render: function Render() {
    return (
      <Inline gap="base" align="center">
        <Tooltip
          delayMs={0}
          content="Lane order is saved the moment you drop a row — there is no separate save step."
        >
          <Button variant="secondary">Lane order</Button>
        </Tooltip>
        <Text tone="secondary">Hover the button.</Text>
      </Inline>
    );
  },
};
