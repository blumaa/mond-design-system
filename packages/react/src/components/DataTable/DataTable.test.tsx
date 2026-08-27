// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { DataTable, type DataColumn } from "./DataTable";

interface Person {
  id: string;
  name: string;
  role: string;
}

const people: Person[] = [
  { id: "a", name: "Ada Lovelace", role: "Teacher" },
  { id: "b", name: "Grace Hopper", role: "Member" },
];

const columns: DataColumn<Person>[] = [
  { key: "name", header: "Name", cell: (person) => person.name },
  { key: "role", header: "Role", cell: (person) => person.role },
];

const selectionLabels = {
  row: (name: string) => `Select ${name}`,
  all: "Select all",
  count: (n: number) => `${n} selected`,
};

function base() {
  return { label: "People", columns, rows: people, rowKey: (person: Person) => person.id };
}

describe("DataTable", () => {
  it("renders a named table of the rows it was given", () => {
    render(<DataTable {...base()} />);
    const table = screen.getByRole("table", { name: "People" });
    expect(within(table).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(table).getByText("Grace Hopper")).toBeInTheDocument();
  });

  it("puts every column's header in the header row", () => {
    render(<DataTable {...base()} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
  });

  it("draws each cell from its column", () => {
    render(<DataTable {...base()} />);
    const rows = screen.getAllByRole("row");
    // header + two people
    expect(rows).toHaveLength(3);
    expect(within(rows[1] as HTMLElement).getByText("Teacher")).toBeInTheDocument();
  });

  it("shows the empty message instead of rows when there are none", () => {
    render(<DataTable {...base()} rows={[]} empty="Nobody yet" />);
    expect(screen.getByText("Nobody yet")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<DataTable {...base()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  /* The header row never goes away, so nothing inside a cell has to stand in
     for it. A cell that repeats its column's header is a cell in a card, and
     this component does not draw cards. */
  it("does not repeat a column's header inside its cells", () => {
    render(<DataTable {...base()} />);
    const row = screen.getAllByRole("row")[1] as HTMLElement;
    expect(row.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  /* Columns needing more room than the screen has pan sideways. A box that
     scrolls only under a pointer is unreachable by keyboard, so the box takes
     focus and carries the table's name for whoever lands on it. */
  it("puts the table in a focusable region named after it", () => {
    render(<DataTable {...base()} />);
    const region = screen.getByRole("region", { name: "People" });
    expect(region).toHaveAttribute("tabindex", "0");
    expect(within(region).getByRole("table")).toBeInTheDocument();
  });

  describe("row actions", () => {
    it("puts a row's controls in its own cell", async () => {
      const onEdit = vi.fn();
      render(
        <DataTable
          {...base()}
          actionsHeader="Actions"
          rowActions={(person) => (
            <button type="button" onClick={() => onEdit(person.id)}>{`Edit ${person.name}`}</button>
          )}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: "Edit Ada Lovelace" }));
      expect(onEdit).toHaveBeenCalledWith("a");
    });

    it("names the actions column", () => {
      render(<DataTable {...base()} actionsHeader="Actions" rowActions={() => <span />} />);
      expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
    });
  });

  /* A row the table still lists but no longer counts — a suspended member, a
     hidden post — reads quieter without leaving the table. */
  it("marks a muted row without hiding it", () => {
    render(<DataTable {...base()} rowMuted={(person) => person.id === "b"} />);
    const rows = screen.getAllByRole("row");
    expect((rows[2] as HTMLElement).className).toContain("muted");
    expect((rows[1] as HTMLElement).className).not.toContain("muted");
  });

  describe("selection", () => {
    function selectable(selected: string[], onSelectedChange = vi.fn()) {
      render(
        <DataTable {...base()} selected={selected} onSelectedChange={onSelectedChange} selectionLabels={selectionLabels} />,
      );
      return onSelectedChange;
    }

    it("names each row's box after the row", () => {
      selectable([]);
      expect(screen.getByRole("checkbox", { name: "Select Ada Lovelace" })).toBeInTheDocument();
    });

    it("reports a row being picked", async () => {
      const onSelectedChange = selectable([]);
      await userEvent.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));
      expect(onSelectedChange).toHaveBeenCalledWith(["a"]);
    });

    it("reports a row being let go", async () => {
      const onSelectedChange = selectable(["a", "b"]);
      await userEvent.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));
      expect(onSelectedChange).toHaveBeenCalledWith(["b"]);
    });

    it("the header box takes every row at once", async () => {
      const onSelectedChange = selectable([]);
      await userEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
      expect(onSelectedChange).toHaveBeenCalledWith(["a", "b"]);
    });

    it("the header box lets every row go at once", async () => {
      const onSelectedChange = selectable(["a", "b"]);
      await userEvent.click(screen.getByRole("checkbox", { name: "Select all" }));
      expect(onSelectedChange).toHaveBeenCalledWith([]);
    });

    /* Some but not all: the header box is neither on nor off, and saying it is
       off would invite a click that takes rows the reader already had. */
    it("the header box is partial when only some rows are taken", () => {
      selectable(["a"]);
      expect(screen.getByRole("checkbox", { name: "Select all" })).toBePartiallyChecked();
    });

    it("the header box is checked when every row is taken", () => {
      selectable(["a", "b"]);
      expect(screen.getByRole("checkbox", { name: "Select all" })).toBeChecked();
    });

    it("keeps the row order the table has, whatever order they were picked in", async () => {
      const onSelectedChange = selectable(["b"]);
      await userEvent.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));
      expect(onSelectedChange).toHaveBeenCalledWith(["a", "b"]);
    });

    it("shows no boxes when the caller holds no selection", () => {
      render(<DataTable {...base()} />);
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("has no axe violations", async () => {
      const { container } = render(
        <DataTable {...base()} selected={["a"]} onSelectedChange={() => {}} selectionLabels={selectionLabels} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* What can be done to a set of rows belongs with the count of them, and the
     count is news: it changes under the reader as they pick. */
  describe("bulk actions", () => {
    function withBulk(selected: string[]) {
      render(
        <DataTable
          {...base()}
          selected={selected}
          onSelectedChange={() => {}}
          selectionLabels={selectionLabels}
          bulkActions={<button type="button">Remove</button>}
        />,
      );
    }

    it("shows the count and the controls once rows are taken", () => {
      withBulk(["a"]);
      expect(screen.getByRole("status")).toHaveTextContent("1 selected");
      expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });

    it("counts in the app's language", () => {
      withBulk(["a", "b"]);
      expect(screen.getByRole("status")).toHaveTextContent("2 selected");
    });

    it("stays away while nothing is taken", () => {
      withBulk([]);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
    });
  });

  it("names a row by the caller's rowLabel rather than its first cell", () => {
    render(
      <DataTable
        {...base()}
        rowLabel={(person) => `${person.name}, ${person.role}`}
        selected={[]}
        onSelectedChange={() => {}}
        selectionLabels={selectionLabels}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Select Ada Lovelace, Teacher" })).toBeInTheDocument();
  });

  it("takes a column's width", () => {
    render(
      <DataTable
        {...base()}
        columns={[{ ...(columns[0] as DataColumn<Person>), width: "40%" }, columns[1] as DataColumn<Person>]}
      />,
    );
    const col = document.querySelector("col");
    expect(col).toHaveStyle({ width: "40%" });
  });

  it("keeps a caller's className and attributes", () => {
    render(<DataTable {...base()} className="roster" data-testid="table" />);
    const root = screen.getByTestId("table");
    expect(root.className).toContain("roster");
  });
});
