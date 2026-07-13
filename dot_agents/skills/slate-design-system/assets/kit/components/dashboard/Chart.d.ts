import type { ReactNode } from 'react';

/** Ordered CSS-var color sequence: blue accent first, then slate-derived tones. */
export const CHART_SERIES: string[];

export interface ChartSeries { name?: string; data: number[]; color?: string; soft?: string; }

export interface LineChartProps {
  series: ChartSeries[];
  labels: string[];
  height?: number;
  yTicks?: number;
  area?: boolean;
  showDots?: boolean;
  legend?: boolean;
  /** Hover crosshair with exact values. On by default. */
  tooltip?: boolean;
  tooltipFormat?: (value: number) => string;
}
export function LineChart(props: LineChartProps): JSX.Element;
export function AreaChart(props: Omit<LineChartProps, 'area'>): JSX.Element;

export interface BarDatum { label: string; value: number; }
export interface BarChartProps {
  data?: BarDatum[];
  series?: ChartSeries[];
  labels?: string[];
  height?: number;
  yTicks?: number;
  legend?: boolean;
  /** Hover highlight with exact values. On by default. */
  tooltip?: boolean;
  tooltipFormat?: (value: number) => string;
}
export function BarChart(props: BarChartProps): JSX.Element;

export interface DonutDatum { label: string; value: number; color?: string; }
export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: ReactNode;
  centerValue?: ReactNode;
  legend?: boolean;
}
export function DonutChart(props: DonutChartProps): JSX.Element;

export interface ChartLegendProps { items: { label?: string; color: string; value?: ReactNode }[]; vertical?: boolean; }
export function ChartLegend(props: ChartLegendProps): JSX.Element;

/** Namespace aggregate: Chart.Line / Chart.Area / Chart.Bar / Chart.Donut / Chart.Legend. */
export const Chart: {
  Line: typeof LineChart;
  Area: typeof AreaChart;
  Bar: typeof BarChart;
  Donut: typeof DonutChart;
  Legend: typeof ChartLegend;
  SERIES: string[];
};
