import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, ToastProvider, useToast } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Toast",
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button onClick={() => toast({ title: "Saved", tone: "success" })}>Success</Button>
      <Button variant="danger" onClick={() => toast({ title: "Failed", description: "Try again.", tone: "danger" })}>
        Danger
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Heads up", duration: 0 })}>
        Sticky
      </Button>
    </div>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
