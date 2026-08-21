import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, UploadProgress } from "@mond-design-system/react";

const meta = {
  title: "Molecules/UploadProgress",
  component: UploadProgress,
} satisfies Meta<typeof UploadProgress>;
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

const check = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 8.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const alert = (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2l6.5 11.5h-13L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 6.5v3.5M8 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Uploading: Story = {
  args: {
    name: "knot-study-04.jpg",
    labels,
    value: 62,
    detail: "3.1 MB of 5 MB",
    onCancel: () => {},
  },
};

/** The server reports no percentage while it works, so the bar stops counting
 *  rather than sitting at a number that has stopped being true. */
export const Processing: Story = {
  args: { name: "knot-study-04.jpg", labels, status: "processing", onCancel: () => {} },
};

export const Done: Story = {
  args: { name: "knot-study-04.jpg", labels, status: "done", mark: check, onRemove: () => {} },
};

export const Failed: Story = {
  args: {
    name: "knot-study-04.jpg",
    labels,
    status: "error",
    error: "The file is larger than 20 MB.",
    mark: alert,
    onRetry: () => {},
    onRemove: () => {},
  },
};

/** With a thumbnail, a row of several says which file is which. */
export const WithPreview: Story = {
  args: { name: "knot-study-04.jpg", labels, value: 62, onCancel: () => {} },
  render: (args) => (
    <Stack gap="base">
      <UploadProgress
        {...args}
        preview={<img src="https://images.unsplash.com/photo-1520975916090-3105956dac38?w=200" alt="" />}
      />
      <UploadProgress
        name="knot-study-05.jpg"
        labels={labels}
        status="done"
        mark={check}
        onRemove={() => {}}
        preview={<img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200" alt="" />}
      />
    </Stack>
  ),
};
