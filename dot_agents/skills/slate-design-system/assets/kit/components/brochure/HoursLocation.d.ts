import type { ReactNode } from 'react';

export interface HoursRow { day: string; /** e.g. "8:00 AM – 6:00 PM"; omit for Closed */ open?: string; }
export interface HoursLocationProps extends React.HTMLAttributes<HTMLDivElement> {
  hours?: HoursRow[];
  address?: ReactNode;
  phone?: string;
  email?: string;
  /** Map embed slot; ImagePlaceholder by default. */
  map?: ReactNode;
  highlightToday?: boolean;
}
export function HoursLocation(props: HoursLocationProps): JSX.Element;

export interface ServiceAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header beside the map. Default "Areas We Serve". */
  title?: ReactNode;
  /** One-line context under the title. */
  lead?: ReactNode;
  /** Rendered as prose text (crawlable — local SEO), not chips. */
  areas?: string[];
  /** Label pinned inside the radius ring, e.g. "~40 min radius". */
  radiusLabel?: ReactNode;
  /** e.g. "Not sure if we cover you? Call — we'll tell you in 30 seconds." */
  note?: ReactNode;
  map?: ReactNode;
}
export function ServiceArea(props: ServiceAreaProps): JSX.Element;
