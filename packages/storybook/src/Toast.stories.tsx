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

export const Default: Story = {
  args: { children: null },
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
