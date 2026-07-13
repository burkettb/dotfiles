import React from 'react';

export const CHART_SERIES = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];
const SOFT = ['var(--chart-1-soft)', 'var(--chart-2-soft)', 'var(--chart-3-soft)', 'var(--chart-4-soft)', 'var(--chart-5-soft)'];

function niceMax(v) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}
function ticks(max, count) {
  return Array.from({ length: count + 1 }, (_, i) => (max / count) * i);
}
function fmt(n) {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

/** Shared cartesian frame: gridlines, y-axis ticks, x labels, hover tooltip.
    Children get {x, y, iw, ih}. Pass `tip` = [{name, color, data}] to enable
    the hover crosshair + exact-value tooltip; `band` snaps to bar groups. */
function Cartesian({ labels = [], max, yTicks = 4, height = 260, padL = 44, padB = 28, padT = 12, padR = 12, band = false, tip, tipFormat, children }) {
  const [w, setW] = React.useState(640);
  const [hi, setHi] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    setW(ref.current.clientWidth);
    return () => ro.disconnect();
  }, []);
  const iw = Math.max(10, w - padL - padR);
  const ih = height - padT - padB;
  const tks = ticks(max, yTicks);
  const y = (v) => padT + ih - (v / max) * ih;
  const x = (i) => padL + (labels.length <= 1 ? iw / 2 : (iw / (labels.length - 1)) * i);
  const cx = (i) => band ? padL + (iw / Math.max(1, labels.length)) * (i + 0.5) : x(i);
  const fmtVal = tipFormat || ((v) => Number(v).toLocaleString());

  const onMove = (e) => {
    if (!tip || !ref.current || labels.length === 0) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (w / rect.width);
    let best = 0, bestD = Infinity;
    for (let i = 0; i < labels.length; i++) {
      const d = Math.abs(cx(i) - mx);
      if (d < bestD) { bestD = d; best = i; }
    }
    setHi(best);
  };

  const tipW = 148;
  const flip = hi >= 0 && cx(hi) + 12 + tipW > w;
  return (
    <div ref={ref} className="sds-chart" onMouseMove={onMove} onMouseLeave={() => setHi(-1)}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} role="img">
        {tks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={y(t)} x2={padL + iw} y2={y(t)} stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="sds-chart__axislabel">{fmt(t)}</text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="sds-chart__axislabel">{l}</text>
        ))}
        {tip && hi >= 0 && (
          <line x1={cx(hi)} y1={padT} x2={cx(hi)} y2={padT + ih} stroke="var(--chart-axis)" strokeWidth="1" strokeDasharray="3 3" />
        )}
        {children({ x, y, iw, ih, padL, padT, hover: hi })}
      </svg>
      {tip && hi >= 0 && (
        <div className="sds-chart-tip" style={{ left: flip ? cx(hi) - 12 - tipW : cx(hi) + 12, top: padT, width: tipW }}>
          <div className="sds-chart-tip__label">{labels[hi]}</div>
          {tip.map((s, si) => (
            <div className="sds-chart-tip__row" key={si}>
              <span className="sds-chart-tip__swatch" style={{ background: s.color }} />
              <span>{s.name || 'Value'}</span>
              <span className="sds-chart-tip__val">{fmtVal(s.data[hi])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** LineChart / AreaChart — pass `area` to fill under the line. */
export function LineChart({ series = [], labels = [], height = 260, yTicks = 4, area = false, showDots = true, legend = true, tooltip = true, tooltipFormat }) {
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.data)));
  const tipSeries = series.map((s, i) => ({ name: s.name, color: s.color || CHART_SERIES[i % CHART_SERIES.length], data: s.data }));
  return (
    <div>
      <Cartesian labels={labels} max={max} yTicks={yTicks} height={height} tip={tooltip ? tipSeries : null} tipFormat={tooltipFormat}>
        {({ x, y, padT, ih, hover }) => series.map((s, si) => {
          const color = s.color || CHART_SERIES[si % CHART_SERIES.length];
          const line = s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
          const areaPath = `${line} L${x(s.data.length - 1).toFixed(1)},${padT + ih} L${x(0).toFixed(1)},${padT + ih} Z`;
          return (
            <g key={si}>
              {area && <path d={areaPath} fill={s.soft || SOFT[si % SOFT.length]} />}
              <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {showDots && s.data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 4 : 3} fill="var(--surface-card)" stroke={color} strokeWidth={hover === i ? 2 : 1.5} />)}
            </g>
          );
        })}
      </Cartesian>
      {legend && <ChartLegend items={series.map((s, i) => ({ label: s.name, color: s.color || CHART_SERIES[i % CHART_SERIES.length] }))} />}
    </div>
  );
}

export function AreaChart(props) { return <LineChart area {...props} />; }

/** BarChart — single or grouped series. `data`=[{label,value}] or pass `series`. */
export function BarChart({ data, series, labels: labelsProp, height = 260, yTicks = 4, legend = true, tooltip = true, tooltipFormat }) {
  const norm = series ? series : [{ name: '', data: data.map((d) => d.value) }];
  const labels = labelsProp || (data ? data.map((d) => d.label) : []);
  const max = niceMax(Math.max(1, ...norm.flatMap((s) => s.data)));
  const groups = labels.length;
  const barGap = 0.34;
  const tipSeries = norm.map((s, i) => ({ name: s.name, color: s.color || CHART_SERIES[i % CHART_SERIES.length], data: s.data }));
  return (
    <div>
      <Cartesian labels={labels} max={max} yTicks={yTicks} height={height} band tip={tooltip ? tipSeries : null} tipFormat={tooltipFormat}>
        {({ y, iw, padL, padT, ih, hover }) => {
          const groupW = iw / groups;
          const inner = groupW * (1 - barGap);
          const bw = inner / norm.length;
          return labels.map((_, gi) => (
            <g key={gi}>
              {norm.map((s, si) => {
                const color = s.color || CHART_SERIES[si % CHART_SERIES.length];
                const v = s.data[gi] || 0;
                const bx = padL + groupW * gi + (groupW - inner) / 2 + bw * si;
                const by = y(v);
                return <rect key={si} x={bx} y={by} width={Math.max(1, bw - 3)} height={padT + ih - by} rx="2" fill={color} opacity={hover === -1 || hover === gi ? 1 : 0.45} />;
              })}
            </g>
          ));
        }}
      </Cartesian>
      {legend && series && <ChartLegend items={norm.map((s, i) => ({ label: s.name, color: s.color || CHART_SERIES[i % CHART_SERIES.length] }))} />}
    </div>
  );
}

/** DonutChart — proportion ring with optional center label/value. */
export function DonutChart({ data = [], size = 180, thickness = 26, centerLabel, centerValue, legend = true }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="sds-donut-wrap">
      <div className="sds-donut">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--chart-grid)" strokeWidth={thickness} />
          {data.map((d, i) => {
            const frac = d.value / total;
            const len = frac * circ;
            const color = d.color || CHART_SERIES[i % CHART_SERIES.length];
            const el = (
              <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={thickness}
                strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset}
                transform={`rotate(-90 ${c} ${c})`}>
                <title>{`${d.label}: ${Number(d.value).toLocaleString()} (${Math.round(frac * 100)}%)`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="sds-donut__center">
            {centerValue && <div className="sds-donut__value">{centerValue}</div>}
            {centerLabel && <div className="sds-donut__label">{centerLabel}</div>}
          </div>
        )}
      </div>
      {legend && <ChartLegend items={data.map((d, i) => ({ label: d.label, color: d.color || CHART_SERIES[i % CHART_SERIES.length], value: d.value }))} vertical />}
    </div>
  );
}

/** ChartLegend — labeled swatches. Never rely on color alone; always labeled. */
export function ChartLegend({ items = [], vertical = false }) {
  return (
    <div className={`sds-chart-legend ${vertical ? 'sds-chart-legend--v' : ''}`}>
      {items.filter((it) => it.label).map((it) => (
        <span className="sds-chart-legend__item" key={it.label}>
          <span className="sds-chart-legend__swatch" style={{ background: it.color }} />
          <span className="sds-chart-legend__label">{it.label}</span>
          {it.value != null && <span className="sds-chart-legend__value">{it.value}</span>}
        </span>
      ))}
    </div>
  );
}

/** Chart — namespace aggregate of the chart primitives (Chart.Line, Chart.Bar…). */
export const Chart = { Line: LineChart, Area: AreaChart, Bar: BarChart, Donut: DonutChart, Legend: ChartLegend, Sparkline: null, SERIES: CHART_SERIES };
