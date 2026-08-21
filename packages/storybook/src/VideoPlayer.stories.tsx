import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack, Text, VideoPlayer } from "@mond-design-system/react";

const meta = {
  title: "Organisms/VideoPlayer",
  component: VideoPlayer,
} satisfies Meta<typeof VideoPlayer>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  region: "Hip harness, slowly",
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  fullscreen: "Fullscreen",
  exitFullscreen: "Leave fullscreen",
  seek: "Seek",
};

const src = "https://media.w3.org/2010/05/sintel/trailer.mp4";
const poster = "https://media.w3.org/2010/05/sintel/poster.png";

/* Inline so the story needs nothing served beside it. */
const vtt = `data:text/vtt,${encodeURIComponent(
  "WEBVTT\n\n00:00:04.000 --> 00:00:09.000\nA trailer, with a caption on it.\n",
)}`;

export const Default: Story = { args: { src, poster, labels } };

/** With no poster the player asks for its own first frame, so the picture is
 *  the video rather than a black rectangle. */
export const NoPoster: Story = { args: { src, labels } };

/** Chapters seek the video and tell the caller, which is how a deep link keeps
 *  up with what is playing. */
export const Chapters: Story = {
  args: {
    src,
    poster,
    labels,
    chapters: [
      { at: 0, label: "Setting up" },
      { at: 12, label: "The safety note" },
      { at: 30, label: "Coming down" },
    ],
    chaptersLabel: "Chapters",
  },
};

/** A track adds the captions control; the browser owns the track menu. */
export const Captions: Story = {
  args: {
    src,
    poster,
    labels,
    captions: { src: vtt, lang: "en", label: "English", defaultOn: true },
    captionsLabel: "Captions",
  },
};

/** `covered` obscures the picture and takes the way in away. What gets past it
 *  is the app's to write, and it is drawn outside the blur. */
export const Covered: Story = {
  args: { src, poster, labels, covered: true },
  render: function Render(args) {
    const [revealed, setRevealed] = useState(false);
    return (
      <VideoPlayer
        {...args}
        covered={!revealed}
        cover={
          revealed ? undefined : (
            <Stack gap="tight" align="center">
              <Text variant="meta" tone="on-media">
                Sensitive content
              </Text>
              <Button size="sm" variant="secondary" onMedia onClick={() => setRevealed(true)}>
                Show
              </Button>
            </Stack>
          )
        }
      />
    );
  },
};
