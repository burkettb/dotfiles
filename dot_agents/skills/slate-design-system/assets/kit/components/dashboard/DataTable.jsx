import React from 'react';
import { Icon } from '../core/Icon.jsx';

function RowMenu({ actions, row }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  return (
    <div className="sds-dt__rowmenu" ref={ref}>
      <button type="button" className="sds-iconbtn sds-iconbtn--sm" aria-label="Row actions" onClick={() => setOpen((o) => !o)}>
        <Icon name="ellipsis-horizontal" size={18} />
      </button>
      {open && (
        <div className="sds-menu sds-dt__rowmenu-pop" role="menu">
          {actions.map((a) => (
            a.divider ? <div className="sds-menu__divider" key={Math.random()} /> :
            <button key={a.label} type="button" role="menuitem" className={`sds-menu__item ${a.danger ? 'sds-menu__item--danger' : ''}`}
              onClick={() => { setOpen(false); a.onClick && a.onClick(row); }}>
              {a.icon && <Icon name={a.icon} size={16} />}{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * DataTable — the workhorse dashboard table. Sortable headers, search/filter,
 * row selection with a bulk-action bar, a per-row action menu, pagination,
 * and a built-in empty state. Hairline structure, hover tint.
 *
 * Filtering: `filterable` renders a slim header row ABOVE the table card —
 * optional `title` + live row count on the left, `toolbar` extras + one
 * global search on the right (visually separate from the table so it costs
 * no table chrome). `filterable="columns"` renders the per-column filter row
 * instead — reserve it for genuinely column-by-column filtering.
 */
export function DataTable({
  columns,
  rows,
  rowKey = 'id',
  selectable = false,
  bulkActions = [],
  rowActions,
  filterable = false,
  title,
  searchPlaceholder = 'Search…',
  toolbar,
  pageSize = 8,
  emptyState,
  className = '',
  ...rest
}) {
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  const [filters, setFilters] = React.useState({});
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(() => new Set());
  const [page, setPage] = React.useState(0);

  const keyOf = (r) => (typeof rowKey === 'function' ? rowKey(r) : r[rowKey]);
  const filterMode = filterable === 'columns' ? 'columns' : filterable ? 'toolbar' : 'none';

  const filtered = React.useMemo(() => {
    let out = rows;
    if (filterMode === 'toolbar' && query) {
      const q = query.toLowerCase();
      out = out.filter((r) => columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(q)));
    }
    for (const [k, v] of Object.entries(filters)) {
      if (!v) continue;
      const q = String(v).toLowerCase();
      out = out.filter((r) => String(r[k] ?? '').toLowerCase().includes(q));
    }
    if (sort.key) {
      const col = columns.find((c) => c.key === sort.key);
      const acc = col && col.sortValue ? col.sortValue : (r) => r[sort.key];
      out = [...out].sort((a, b) => {
        const av = acc(a), bv = acc(b);
        if (av == null) return 1; if (bv == null) return -1;
        const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sort.dir === 'asc' ? cmp : -cmp;
      });
    }
    return out;
  }, [rows, filters, query, filterMode, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const curPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(curPage * pageSize, curPage * pageSize + pageSize);

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(keyOf(r)));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allOnPageSelected) pageRows.forEach((r) => next.delete(keyOf(r)));
    else pageRows.forEach((r) => next.add(keyOf(r)));
    setSelected(next);
  };
  const toggleOne = (r) => {
    const next = new Set(selected);
    const k = keyOf(r); next.has(k) ? next.delete(k) : next.add(k);
    setSelected(next);
  };
  const clearSel = () => setSelected(new Set());

  const onSort = (col) => {
    if (!col.sortable) return;
    setSort((s) => s.key === col.key ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: col.key, dir: 'asc' });
  };

  const colSpan = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);
  const selCount = selected.size;
  const hasHeaderRow = filterMode === 'toolbar' || title != null || toolbar != null;

  return (
    <div className={`sds-dt-wrap ${className}`} {...rest}>
      {hasHeaderRow && (
        <div className="sds-dt__toolbar">
          <div className="sds-dt__toolbar-left">
            {title != null && <span className="sds-dt__title">{title}</span>}
            {title != null && <span className="sds-dt__count">{filtered.length}</span>}
          </div>
          <div className="sds-dt__toolbar-right">
            {toolbar}
            {filterMode === 'toolbar' && (
              <div className="sds-search sds-dt__search">
                <Icon name="magnifying-glass" size={16} className="sds-search__icon" />
                <input className="sds-search__input" type="search" placeholder={searchPlaceholder} value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(0); }} />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="sds-dt">
      {selectable && selCount > 0 && (
        <div className="sds-dt__bulkbar">
          <span className="sds-dt__bulkcount">{selCount} selected</span>
          <div className="sds-dt__bulkactions">
            {bulkActions.map((a) => (
              <button key={a.label} type="button" className={`sds-btn sds-btn--sm ${a.danger ? 'sds-btn--danger' : 'sds-btn--secondary'}`}
                onClick={() => a.onClick && a.onClick([...selected])}>
                {a.icon && <Icon name={a.icon} size={15} />}{a.label}
              </button>
            ))}
            <button type="button" className="sds-btn sds-btn--sm sds-btn--ghost" onClick={clearSel}>Clear</button>
          </div>
        </div>
      )}
      <div className="sds-dt__scroll">
        <table className="sds-table sds-dt__table">
          <thead>
            <tr>
              {selectable && (
                <th className="sds-dt__checkcell">
                  <label className="sds-choice"><input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} aria-label="Select all" />
                    <span className="sds-choice__box" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2l2.6 2.6L10 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  </label>
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: col.align || 'left', width: col.width }} className={col.sortable ? 'sds-dt__th--sortable' : ''} onClick={() => onSort(col)}>
                  <span className="sds-dt__th-inner">
                    {col.header}
                    {col.sortable && (
                      <Icon name="chevron-right" size={12} className={`sds-dt__sorticon ${sort.key === col.key ? `sds-dt__sorticon--${sort.dir}` : 'sds-dt__sorticon--idle'}`} />
                    )}
                  </span>
                </th>
              ))}
              {rowActions && <th className="sds-dt__actioncell" aria-label="Actions" />}
            </tr>
            {filterMode === 'columns' && (
              <tr className="sds-dt__filterrow">
                {selectable && <th />}
                {columns.map((col) => (
                  <th key={col.key}>
                    {col.filter !== false && (
                      <input className="sds-input sds-dt__filterinput" placeholder={col.filterPlaceholder || 'Filter…'} value={filters[col.key] || ''}
                        onChange={(e) => { setFilters((f) => ({ ...f, [col.key]: e.target.value })); setPage(0); }} />
                    )}
                  </th>
                ))}
                {rowActions && <th />}
              </tr>
            )}
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr><td colSpan={colSpan} className="sds-dt__emptycell">{emptyState || <div className="sds-dt__empty-default">No results.</div>}</td></tr>
            ) : pageRows.map((r) => {
              const k = keyOf(r); const isSel = selected.has(k);
              return (
                <tr key={k} className={isSel ? 'sds-dt__row--selected' : ''}>
                  {selectable && (
                    <td className="sds-dt__checkcell">
                      <label className="sds-choice"><input type="checkbox" checked={isSel} onChange={() => toggleOne(r)} aria-label="Select row" />
                        <span className="sds-choice__box" aria-hidden="true"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6.2l2.6 2.6L10 3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                      </label>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align || 'left' }} className={col.mono ? 'sds-type-mono' : ''}>
                      {col.render ? col.render(r) : r[col.key]}
                    </td>
                  ))}
                  {rowActions && <td className="sds-dt__actioncell"><RowMenu actions={rowActions(r)} row={r} /></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > pageSize && (
        <div className="sds-dt__pagination">
          <span className="sds-dt__pageinfo">
            {curPage * pageSize + 1}–{Math.min((curPage + 1) * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="sds-dt__pagebtns">
            <button type="button" className="sds-btn sds-btn--sm sds-btn--secondary" disabled={curPage === 0} onClick={() => setPage(curPage - 1)}>Previous</button>
            <span className="sds-dt__pagenum">Page {curPage + 1} of {pageCount}</span>
            <button type="button" className="sds-btn sds-btn--sm sds-btn--secondary" disabled={curPage >= pageCount - 1} onClick={() => setPage(curPage + 1)}>Next</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
