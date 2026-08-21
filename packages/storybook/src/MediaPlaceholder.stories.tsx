import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, MediaPlaceholder, Stack, Text } from "@mond-design-system/react";

const meta = {
  title: "Molecules/MediaPlaceholder",
  component: MediaPlaceholder,
} satisfies Meta<typeof MediaPlaceholder>;
export default meta;
type Story = StoryObj<typeof meta>;

const photo = "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800";

const glyph = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 16l5-4 4 3 3-2 6 4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/** No picture yet: the box still holds its place in the layout. */
export const Empty: Story = { args: { glyph, caption: "No image yet" } };

export const WithPicture: Story = { args: { src: photo, alt: "A rope coiled on a wooden floor" } };

/** A caption over a picture sits on a scrim, not on the photo. */
export const Captioned: Story = {
  args: { src: photo, alt: "A rope coiled on a wooden floor", caption: "Session 4 · warm-up" },
};

export const Portrait: Story = { args: { aspect: "4 / 5", src: photo, alt: "" } };

/** The blur reaches the picture and stops at the cover, so whatever asks for
 *  consent stays readable. */
export const Sensitive: Story = {
  args: {
    src: photo,
    alt: "",
    blurred: true,
    cover: (
      <Stack gap="tight" align="center">
        <Text variant="meta" tone="on-media">
          Sensitive content
        </Text>
        <Button size="sm" variant="secondary">
          Show
        </Button>
      </Stack>
    ),
  },
};

/** A source that will not load falls back to the empty surface rather than to
 *  a broken-image glyph. */
export const Broken: Story = { args: { src: "/nope.jpg", glyph, caption: "Image unavailable" } };
