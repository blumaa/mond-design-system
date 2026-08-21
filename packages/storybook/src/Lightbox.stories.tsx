import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Lightbox } from "@mond-design-system/react";

const meta = {
  title: "Organisms/Lightbox",
  component: Lightbox,
} satisfies Meta<typeof Lightbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = { dialog: "Image", close: "Close", zoomIn: "Zoom in", zoomOut: "Zoom out" };
const photo = "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1600";

const args = { open: false, onClose: () => {}, src: photo, labels };

/** Zoom with the controls, a double tap, a pinch, or a trackpad pinch — which
 *  arrives as a ctrl-wheel. Past 1× the picture pans, held inside its own
 *  edges. */
export const Default: Story = {
  args,
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open the picture</Button>
        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          src={photo}
          alt="A rope harness across the back"
          labels={labels}
        />
      </>
    );
  },
};

/** A caption sits under the picture, clear of the home indicator. */
export const Captioned: Story = {
  args,
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open the picture</Button>
        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          src={photo}
          alt="A rope harness across the back"
          caption="Where the load is carried"
          labels={labels}
        />
      </>
    );
  },
};
