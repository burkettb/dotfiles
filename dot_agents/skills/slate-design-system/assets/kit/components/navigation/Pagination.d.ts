export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page, 1-indexed. */
  page?: number;
  pageCount?: number;
  onChange?: (page: number) => void;
  /** Pages shown on each side of the current page. */
  siblingCount?: number;
}
export function Pagination(props: PaginationProps): JSX.Element;
