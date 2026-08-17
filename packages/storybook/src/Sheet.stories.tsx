import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Sheet, SheetBody, SheetHeader, Text } from "@mond-design-system/react";

const meta = {
  title: "Molecules/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
  args: { open: false, onClose: () => {}, label: "", children: null },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show filters</Button>
        <Sheet open={open} onClose={() => setOpen(false)} label="Filters">
          <SheetHeader>Filters</SheetHeader>
          <SheetBody>
            <Text>Bottom sheet content. Escape or scrim click closes.</Text>
          </SheetBody>
        </Sheet>
      </>
    );
  },
};
