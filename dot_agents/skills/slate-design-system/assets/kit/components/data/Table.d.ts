import type { ReactNode } from 'react';

export interface TableColumn<T = any> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer; receives the row record. */
  render?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  rows: T[];
  /** Field used as the React key (default "id"). */
  rowKey?: string;
  className?: string;
}
/**
 * Data table — hairline separators, muted caps header, hover tint.
 * @startingPoint section="Data" subtitle="Rows with muted caps header & hover tint" viewport="700x260"
 */
export function Table(props: TableProps): JSX.Element;
