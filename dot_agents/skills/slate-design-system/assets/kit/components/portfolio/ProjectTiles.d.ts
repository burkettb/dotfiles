import type { ReactNode } from 'react';

export interface ProjectTile {
  title: string;
  /** media variant: small line under the title in the bar. */
  subtitle?: ReactNode;
  /** text variant: the one-line story — what it is and why it exists. */
  summary?: ReactNode;
  /** text variant: mono meta row, e.g. "macOS menu bar · Swift · 2025". */
  meta?: ReactNode;
  tags?: string[];
  tagHue?: 'blue' | 'teal' | 'violet' | 'amber' | 'rose';
  /** media variant: the visual (ImagePlaceholder until real shots exist). */
  media?: ReactNode;
  href?: string;
}
export interface ProjectTilesProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ProjectTile[];
  columns?: number;
  /** "text" (default): type-led tiles — software rarely photographs well.
      "media": image-forward tiles for work with a genuinely good visual. */
  variant?: 'text' | 'media';
  onOpen?: (p: ProjectTile) => void;
}
export function ProjectTiles(props: ProjectTilesProps): JSX.Element;
