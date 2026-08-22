import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileDrop, Icon, Stack, UploadProgress } from "@mond-design-system/react";

const meta = {
  title: "Molecules/FileDrop",
  component: FileDrop,
} satisfies Meta<typeof FileDrop>;
export default meta;
type Story = StoryObj<typeof meta>;

const labels = {
  uploading: "Uploading",
  processing: "Processing",
  done: "Uploaded",
  error: "Upload failed",
  cancel: "Cancel upload",
  retry: "Try again",
  remove: "Remove",
};

export const Default: Story = {
  args: {
    label: "Drop photos here, or choose from your device",
    hint: "JPG or PNG, up to 20 MB each",
    accept: "image/*",
    multiple: true,
    onFiles: () => {},
  },
};

/** A glyph over the words says what kind of thing is wanted before the words
    are read. It comes from the app's icon set — the system has none. */
export const WithIcon: Story = {
  args: {
    ...Default.args,
    icon: <Icon name="star" size="lg" />,
  },
};

/** Nothing more fits: the zone stays where it was, so the rule reads where
    the invitation was. */
export const Disabled: Story = {
  args: {
    label: "One video at a time",
    hint: "Remove the one you have to add another",
    disabled: true,
    onFiles: () => {},
  },
};

/** What it is for: the zone hands files over, UploadProgress says how far
    each one has got. */
export const WithUploads: Story = {
  args: { label: "Drop photos here", onFiles: () => {}, multiple: true },
  render: function Render(args) {
    const [names, setNames] = useState<string[]>(["knot.jpg"]);
    return (
      <Stack gap="tight">
        <FileDrop {...args} onFiles={(files) => setNames(files.map((file) => file.name))} />
        {names.map((name) => (
          <UploadProgress key={name} name={name} labels={labels} value={62} />
        ))}
      </Stack>
    );
  },
};
