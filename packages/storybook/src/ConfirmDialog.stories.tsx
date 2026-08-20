import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ConfirmDialog } from "@mond-design-system/react";

const meta = {
  title: "Organisms/ConfirmDialog",
  component: ConfirmDialog,
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const settle = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Danger: Story = {
  args: {
    title: "Delete session?",
    confirmLabel: "Delete",
    onConfirm: () => Promise.resolve(),
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
          onConfirm={() => settle(800)}
          title="Delete session?"
          description="This cannot be undone."
          confirmLabel="Delete"
          tone="danger"
        />
      </>
    );
  },
};

/** The dialog owns the whole lifecycle: busy while the promise is pending,
 *  and a rejection keeps it open with the failure shown. */
export const Failure: Story = {
  args: {
    title: "Remove member?",
    confirmLabel: "Remove",
    onConfirm: () => Promise.resolve(),
  },
  render: function Render() {
    const [asked, setAsked] = useState<string | null>(null);
    return (
      <>
        <Button variant="secondary" onClick={() => setAsked("m-1")}>
          Remove member
        </Button>
        <ConfirmDialog
          target={asked}
          onClose={() => setAsked(null)}
          onConfirm={async () => {
            await settle(800);
            throw new Error("You are the group's last admin.");
          }}
          title="Remove member?"
          description="They can be invited again later."
          confirmLabel="Remove"
          tone="warning"
        />
      </>
    );
  },
};
