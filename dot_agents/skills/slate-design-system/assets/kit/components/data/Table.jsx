import React from 'react';

/**
 * Table — hairline row separators, muted uppercase header, hover tint.
 * `columns` is [{ key, header, render?, align? }]; `rows` is an array of
 * record objects. Row actions belong in a single kebab (⋯) menu per row.
 */
export function Table({ columns = [], rows = [], rowKey = 'id', className = '' }) {
  return (
    <table className={`sds-table ${className}`}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align || 'left' }}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row[rowKey] ?? i}>
            {columns.map((c) => (
              <td key={c.key} style={{ textAlign: c.align || 'left' }}>
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
