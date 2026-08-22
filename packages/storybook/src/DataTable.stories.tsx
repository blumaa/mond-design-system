import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, DataTable, Tag, type DataColumn } from "@mond-design-system/react";
import story from "./story.module.css";

interface Person {
  id: string;
  name: string;
  role: string;
  joined: string;
  suspended?: boolean;
}

const people: Person[] = [
  { id: "a", name: "Ada Lovelace", role: "Teacher", joined: "Mar 2024" },
  { id: "b", name: "Grace Hopper", role: "Member", joined: "Jul 2024" },
  { id: "c", name: "Alan Turing", role: "Member", joined: "Jan 2025", suspended: true },
];

const columns: DataColumn<Person>[] = [
  { key: "name", header: "Name", cell: (person) => person.name },
  { key: "role", header: "Role", cell: (person) => <Tag>{person.role}</Tag> },
  { key: "joined", header: "Joined", cell: (person) => person.joined },
];

const labels = {
  row: (name: string) => `Select ${name}`,
  all: "Select all",
  count: (n: number) => `${n} selected`,
};

const meta = {
  title: "Organisms/DataTable",
  component: DataTable,
} satisfies Meta<typeof DataTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { label: "People", columns: [], rows: [], rowKey: () => "" },
  render: () => (
    <div className={story.frame}>
      <DataTable
        label="People"
        columns={columns}
        rows={people}
        rowKey={(person) => person.id}
        rowMuted={(person) => person.suspended === true}
        actionsHeader="Actions"
        rowActions={(person) => (
          <Button variant="secondary" size="sm" aria-label={`Edit ${person.name}`}>
            Edit
          </Button>
        )}
        empty="Nobody yet"
      />
    </div>
  ),
};

export const Selectable: Story = {
  args: { label: "People", columns: [], rows: [], rowKey: () => "" },
  render: function Selectable() {
    const [selected, setSelected] = useState<string[]>(["b"]);
    return (
      <div className={story.frame}>
        <DataTable
          label="People"
          columns={columns}
          rows={people}
          rowKey={(person) => person.id}
          selected={selected}
          onSelectedChange={setSelected}
          selectionLabels={labels}
          bulkActions={<Button variant="danger" size="sm">Remove</Button>}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: { label: "People", columns: [], rows: [], rowKey: () => "" },
  render: () => (
    <div className={story.frame}>
      <DataTable label="People" columns={columns} rows={[]} rowKey={(person: Person) => person.id} empty="Nobody yet" />
    </div>
  ),
};
