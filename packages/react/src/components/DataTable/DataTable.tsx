import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import { Checkbox } from "../Checkbox/Checkbox";
import { Text } from "../Text/Text";
import styles from "./DataTable.module.css";

export interface DataColumn<Row> {
  key: string;
  /** Read in the header row. */
  header: ReactNode;
  /** CSS width for the column, applied through the colgroup. */
  width?: string;
  cell: (row: Row) => ReactNode;
}

export interface DataTableSelectionLabels {
  /** Names one row's box — "Select Ada Lovelace". The row's own label is
      handed in, so the sentence is the app's to build. */
  row: (label: string) => string;
  /** Names the header box, which takes or lets go of every row at once. */
  all: string;
  /** "3 selected" — a function, because only the app knows how its language
      counts. */
  count: (selected: number) => string;
}

type DataTableSelection =
  | {
      /** Row keys currently taken. Held by the caller: the table draws it and
          says what changed, and never keeps a second copy. */
      selected: string[];
      onSelectedChange: (keys: string[]) => void;
      selectionLabels: DataTableSelectionLabels;
      /** What can be done to the taken rows, shown with the count of them. */
      bulkActions?: ReactNode;
    }
  | {
      selected?: undefined;
      onSelectedChange?: undefined;
      selectionLabels?: undefined;
      bulkActions?: undefined;
    };

export type DataTableProps<Row> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Names the table. Required: a table of rows with no name is a grid of
      values with nothing saying what they are a list of. */
  label: string;
  columns: DataColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Names one row where its first cell will not do — a row led by an avatar,
      or by a title that repeats down the table. */
  rowLabel?: (row: Row) => string;
  /** What can be done to one row, in a column of its own at the end. */
  rowActions?: (row: Row) => ReactNode;
  /** Names that column. */
  actionsHeader?: ReactNode;
  /** A row the table still lists but no longer counts — suspended, hidden. */
  rowMuted?: (row: Row) => boolean;
  /** Shown in place of the rows when there are none. */
  empty?: ReactNode;
  ref?: Ref<HTMLDivElement>;
} & DataTableSelection;

/**
 * Rows and columns, at every width.
 *
 * A table is for reading across a row and comparing down a column, and it stays
 * one on a narrow screen rather than turning into something else: where the
 * columns need more room than there is, the table pans sideways inside a box
 * that takes focus. An app wanting cards on a phone builds cards — that is a
 * different component, not this one wearing a second layout.
 *
 * ```tsx
 * <DataTable
 *   label={t("admin.members.table")}
 *   columns={[
 *     { key: "name", header: t("admin.name"), cell: (m) => m.name },
 *     { key: "role", header: t("admin.role"), cell: (m) => <Tag>{m.role}</Tag> },
 *   ]}
 *   rows={members}
 *   rowKey={(m) => m.id}
 *   empty={t("admin.members.none")}
 * />
 * ```
 */
export function DataTable<Row>({
  label,
  columns,
  rows,
  rowKey,
  rowLabel,
  rowActions,
  actionsHeader,
  rowMuted,
  empty,
  ref,
  selected,
  onSelectedChange,
  selectionLabels,
  bulkActions,
  className,
  ...rest
}: DataTableProps<Row>): ReactElement {
  const selectable = selected !== undefined;
  const keys = rows.map(rowKey);
  const all = selectable && keys.length > 0 && keys.every((key) => selected.includes(key));
  const some = selectable && !all && keys.some((key) => selected.includes(key));
  const span = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  /* Reported in the table's own order, not the order they were clicked in:
     the caller reads it back as a list of rows, and a list of rows has the
     order the reader sees. */
  const toggle = (key: string, taken: boolean) => {
    if (selected === undefined) return;
    const next = taken ? [...selected, key] : selected.filter((each) => each !== key);
    onSelectedChange(keys.filter((each) => next.includes(each)));
  };

  const nameOf = (row: Row): string => {
    if (rowLabel !== undefined) return rowLabel(row);
    const first = columns[0]?.cell(row);
    return typeof first === "string" ? first : rowKey(row);
  };

  return (
    <div className={cx(styles.root, className)} ref={ref} {...rest}>
      {/* Named as well as the table it holds: whoever tabs into the box to
          pan it is told what they have landed in. */}
      <div className={styles.scroll} role="region" aria-label={label} tabIndex={0}>
        <table className={styles.table} aria-label={label}>
          <colgroup>
            {selectable && <col />}
            {columns.map((column) => (
              <col
                key={column.key}
                style={column.width !== undefined ? { width: column.width } : undefined}
              />
            ))}
            {rowActions && <col />}
          </colgroup>

          <thead>
            <tr className={styles.row}>
              {selectable && (
                <th scope="col" className={styles.select}>
                  <Checkbox
                    label={selectionLabels.all}
                    labelHidden
                    checked={all}
                    indeterminate={some}
                    onChange={(event) => onSelectedChange(event.target.checked ? keys : [])}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th scope="col" key={column.key} className={styles.cell}>
                  {column.header}
                </th>
              ))}
              {rowActions && (
                <th scope="col" className={styles.actions}>
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>

          <tbody className={styles.body}>
            {rows.length > 0
              ? rows.map((row) => {
                  const key = rowKey(row);
                  const taken = selected?.includes(key) ?? false;
                  return (
                    <tr
                      key={key}
                      className={cx(
                        styles.row,
                        taken && styles.selected,
                        rowMuted?.(row) === true && styles.muted,
                      )}
                    >
                      {selectable && (
                        <td className={styles.select}>
                          <Checkbox
                            label={selectionLabels.row(nameOf(row))}
                            labelHidden
                            checked={taken}
                            onChange={(event) => toggle(key, event.target.checked)}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className={styles.cell}>
                          {column.cell(row)}
                        </td>
                      ))}
                      {rowActions && <td className={styles.actions}>{rowActions(row)}</td>}
                    </tr>
                  );
                })
              : empty !== undefined && (
                  <tr className={styles.row}>
                    <td className={styles.empty} colSpan={span}>
                      <Text variant="note">{empty}</Text>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {selectable && selected.length > 0 && bulkActions !== undefined && (
        <div className={styles.bulk} role="status">
          <Text variant="meta">{selectionLabels.count(selected.length)}</Text>
          <div className={styles.bulkActions}>{bulkActions}</div>
        </div>
      )}
    </div>
  );
}
