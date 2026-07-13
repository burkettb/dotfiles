import type { ReactNode } from 'react';

export interface DataTableColumn<Row = any> {
  key: string;
  header: ReactNode;
  sortable?: boolean;
  /** Custom accessor used for sorting (defaults to row[key]). */
  sortValue?: (row: Row) => string | number;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** Render tabular/mono cell text. */
  mono?: boolean;
  /** Cell renderer; defaults to row[key]. */
  render?: (row: Row) => ReactNode;
  /** Set false to hide this column's filter input when filterable. */
  filter?: boolean;
  filterPlaceholder?: string;
}
export interface RowAction<Row = any> { label?: string; icon?: string; danger?: boolean; divider?: boolean; onClick?: (row: Row) => void; }
export interface BulkAction { label: string; icon?: string; danger?: boolean; onClick?: (selectedKeys: any[]) => void; }

export interface DataTableProps<Row = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** Field name or accessor for a stable row key. */
  rowKey?: string | ((row: Row) => any);
  selectable?: boolean;
  bulkActions?: BulkAction[];
  /** Return the action menu for a given row. Presence adds the ⋯ column. */
  rowActions?: (row: Row) => RowAction<Row>[];
  /** `true` = slim header row above the table card: title + count left,
      search on the right. `'columns'` = per-column filter row (rare). */
  filterable?: boolean | 'columns';
  /** Table title in the header row, with a live row count beside it. */
  title?: ReactNode;
  /** Placeholder for the header-row search field. */
  searchPlaceholder?: string;
  /** Extra header-row content (e.g. FilterBar chips), left of the search. */
  toolbar?: ReactNode;
  pageSize?: number;
  /** Shown in the body when there are no rows/results. */
  emptyState?: ReactNode;
}
export function DataTable<Row = any>(props: DataTableProps<Row>): JSX.Element;
