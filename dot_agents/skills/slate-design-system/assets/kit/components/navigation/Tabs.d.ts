export interface TabItem { value: string; label: string; }

export interface TabsProps {
  /** Tabs as strings or { value, label }. */
  items: (string | TabItem)[];
  /** Currently selected value. */
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}
export function Tabs(props: TabsProps): JSX.Element;
