export interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono explainer naming what belongs here, e.g. "product screenshot". */
  label?: string;
  /** CSS aspect-ratio, e.g. "16/10". */
  ratio?: string;
  height?: number | string;
  radius?: string;
}
export function ImagePlaceholder(props: ImagePlaceholderProps): JSX.Element;
