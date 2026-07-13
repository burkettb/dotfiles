import type { ReactNode } from 'react';

export interface BlogCardProps extends React.HTMLAttributes<HTMLElement> {
  media?: ReactNode;
  tag?: ReactNode;
  tagHue?: 'blue' | 'teal' | 'violet' | 'amber' | 'rose';
  title?: ReactNode;
  excerpt?: ReactNode;
  author?: string;
  date?: ReactNode;
  readTime?: ReactNode;
  href?: string;
  onClick?: (e: any) => void;
}
export function BlogCard(props: BlogCardProps): JSX.Element;

export interface ArticleLayoutProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  author?: string;
  role?: string;
  date?: ReactNode;
  readTime?: ReactNode;
  hero?: ReactNode;
  /** Prose: plain h2/h3/p/ul/blockquote children get article styling. */
  children?: ReactNode;
}
export function ArticleLayout(props: ArticleLayoutProps): JSX.Element;
