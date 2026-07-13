export interface IconProps {
  /** Heroicons v2 solid icon name, e.g. "home", "magnifying-glass". */
  name: string;
  /** Pixel size (square). Default 20. */
  size?: number;
  /** Accessible label; when omitted the icon is aria-hidden. */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
