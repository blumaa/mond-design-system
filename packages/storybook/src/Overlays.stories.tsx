import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  ConfirmDialog,
  Field,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Sheet,
  SheetBody,
  SheetHeader,
  Stack,
  Text,
} from "@mond-design-system/react";

const meta = {
  title: "Molecules/Overlays",
  component: Modal,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ModalStory: Story = {
  name: "Modal",
  args: { open: false, onClose: () => {}, label: "", children: null },
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit session</Button>
        <Modal open={open} onClose={() => setOpen(false)} label="Edit session">
          <ModalHeader>Edit session</ModalHeader>
          <ModalBody>
            <Stack gap="base">
              <Field label="Title">
                <Input defaultValue="Tuesday practice" />
              </Field>
              <Field label="Location">
                <Input defaultValue="Studio B" />
              </Field>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};

export const SheetStory: Story = {
  name: "Sheet",
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

export const ConfirmStory: Story = {
  name: "ConfirmDialog",
  args: { open: false, onClose: () => {}, label: "", children: null },
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
