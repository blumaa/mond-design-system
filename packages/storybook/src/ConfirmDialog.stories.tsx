import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ConfirmDialog } from "@mond-design-system/react";

const meta = {
  title: "Molecules/ConfirmDialog",
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    open: false,
    onClose: () => {},
    onConfirm: () => {},
    title: "Delete session?",
    confirmLabel: "Delete",
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete session
        </Button>
        <ConfirmDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Delete session?"
          description="This cannot be undone."
          confirmLabel="Delete"
          danger
        />
      </>
    );
  },
};
