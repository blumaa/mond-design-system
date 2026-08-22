import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Inline, ToastProvider, useToast } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Toast",
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast } = useToast();
  return (
    <Inline>
      <Button onClick={() => toast({ title: "Saved", tone: "success" })}>Success</Button>
      <Button variant="danger" onClick={() => toast({ title: "Failed", description: "Try again.", tone: "danger" })}>
        Danger
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Heads up", duration: 0 })}>
        Sticky
      </Button>
    </Inline>
  );
}

function Asking() {
  const { toast } = useToast();
  return (
    <Inline>
      <Button
        onClick={() =>
          toast({
            title: "Update ready",
            description: "Reload to get the new version.",
            duration: 0,
            action: { label: "Reload", onClick: () => {} },
            onDismiss: () => {},
          })
        }
      >
        Offer an update
      </Button>
    </Inline>
  );
}

export const Default: Story = {
  args: { children: null, regionLabel: "Notifications", dismissLabel: "Dismiss" },
  render: () => (
    <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
      <Demo />
    </ToastProvider>
  ),
};

/** A message that asks for something puts the doing beside the saying. Taking
    the action closes the toast; `onDismiss` fires however it leaves, so a
    nudge that has been turned down can remember it. */
export const WithAction: Story = {
  args: { children: null, regionLabel: "Notifications", dismissLabel: "Dismiss" },
  render: () => (
    <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
      <Asking />
    </ToastProvider>
  ),
};
