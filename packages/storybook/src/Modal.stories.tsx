import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Field,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@mond-design-system/react";

const meta = {
  title: "Molecules/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composed: Story = {
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
