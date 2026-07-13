export interface Crumb { label: string; href?: string; }
export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items?: Crumb[];
  onNavigate?: (item: Crumb) => void;
}
export function Breadcrumbs(props: BreadcrumbsProps): JSX.Element;
