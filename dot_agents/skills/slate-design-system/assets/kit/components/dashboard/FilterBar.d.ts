import type { ReactNode } from 'react';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode;
  children?: ReactNode;
}
export function FilterBar(props: FilterBarProps): JSX.Element;

export interface DateRangePreset { key: string; label: string; }
export interface DateRangePickerProps {
  value?: string;
  onChange?: (key: string) => void;
  presets?: DateRangePreset[];
  className?: string;
}
export function DateRangePicker(props: DateRangePickerProps): JSX.Element;

export interface MultiSelectOption { key: string; label: string; }
export interface MultiSelectFilterProps {
  label: ReactNode;
  options?: (string | MultiSelectOption)[];
  value?: string[];
  onChange?: (next: string[]) => void;
  className?: string;
}
export function MultiSelectFilter(props: MultiSelectFilterProps): JSX.Element;
