import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ImageCarousel, Stack, Text } from "@mond-design-system/react";
import type { CarouselSlide } from "@mond-design-system/react";

const meta = {
  title: "Organisms/ImageCarousel",
  component: ImageCarousel,
} satisfies Meta<typeof ImageCarousel>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  region: "Images",
  carouselRole: "carousel",
  slideRole: "slide",
  previous: "Previous image",
  next: "Next image",
  counter: (current: number, total: number) => `${current} of ${total}`,
  slide: (position: number) => `Image ${position}`,
  more: (hidden: number) => `${hidden} more images`,
};

const photo = (id: string, seed: string, alt: string): CarouselSlide => ({
  id,
  src: `https://images.unsplash.com/${seed}?w=900`,
  alt,
});

const slides: CarouselSlide[] = [
  photo("a", "photo-1520975916090-3105956dac38", "A rope coiled on a wooden floor"),
  photo("b", "photo-1518709268805-4e9042af2176", "Red cord against a dark wall"),
  photo("c", "photo-1503694978374-8a2fa686963a", "A knot half tied"),
  photo("d", "photo-1517816743773-6e0fd518b4a6", "Rope over a beam"),
  photo("e", "photo-1509266272358-7701da638078", "Coils on a table"),
  photo("f", "photo-1494537176433-7a3c4ef2046f", "A length of jute"),
];

export const Default: Story = { args: { slides: slides.slice(0, 3), labels } };

/** Past `maxThumbnails` the rest collapse into one button, which pages to the
 *  first frame no thumbnail stands for. */
export const ManyFrames: Story = { args: { slides, labels, maxThumbnails: 4 } };

export const Dots: Story = { args: { slides: slides.slice(0, 4), labels, pager: "dots" } };

export const OneFrame: Story = { args: { slides: slides.slice(0, 1), labels } };

/** What asks for consent is the app's, so it arrives as a node on the slide.
 *  The blur reaches the picture and stops at the cover. */
export const Covered: Story = {
  args: { slides: slides.slice(0, 3), labels },
  render: function Render(args) {
    const [revealed, setRevealed] = useState(false);
    return (
      <ImageCarousel
        {...args}
        slides={args.slides.map((slide, position) => ({
          ...slide,
          covered: position === 0 && !revealed,
          cover:
            position === 0 && !revealed ? (
              <Stack gap="tight" align="center">
                <Text variant="meta" tone="on-media">
                  Sensitive content
                </Text>
                <Button size="sm" variant="secondary" onMedia onClick={() => setRevealed(true)}>
                  Show
                </Button>
              </Stack>
            ) : undefined,
        }))}
      />
    );
  },
};

/** With somewhere to send a frame, the carousel offers a control and opens on
 *  a tap — a swipe stays a swipe. */
export const Zoomable: Story = {
  args: {
    slides: slides.slice(0, 3),
    labels,
    onZoom: (index: number) => window.alert(`Open image ${index + 1}`),
    zoomLabel: "View larger",
    zoomIcon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
};
