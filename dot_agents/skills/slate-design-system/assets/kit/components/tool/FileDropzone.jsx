import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * FileDropzone — drag-and-drop file intake with progress and error states.
 * States: idle → uploading (determinate bar) → done | error. Fully controlled
 * via `status`/`progress`, or leave uncontrolled and it simulates locally so
 * prototypes feel real.
 */
export function FileDropzone({
  accept,
  hint,
  status: statusProp,
  progress: progressProp,
  error,
  file: fileProp,
  onFile,
  onClear,
  simulate = true,
  className = '',
  ...rest
}) {
  const [drag, setDrag] = React.useState(false);
  const [local, setLocal] = React.useState({ status: 'idle', progress: 0, file: null });
  const inputRef = React.useRef(null);
  const status = statusProp || local.status;
  const progress = progressProp != null ? progressProp : local.progress;
  const file = fileProp || local.file;

  const take = (f) => {
    if (!f) return;
    onFile && onFile(f);
    if (!statusProp && simulate) {
      setLocal({ status: 'uploading', progress: 0, file: f });
      let p = 0;
      const tick = setInterval(() => {
        p += 12 + Math.random() * 18;
        if (p >= 100) { clearInterval(tick); setLocal({ status: 'done', progress: 100, file: f }); }
        else setLocal({ status: 'uploading', progress: Math.round(p), file: f });
      }, 160);
    }
  };
  const clear = () => { setLocal({ status: 'idle', progress: 0, file: null }); onClear && onClear(); };

  if (status === 'uploading' || status === 'done' || status === 'error') {
    return (
      <div className={`sds-tl-drop sds-tl-drop--file ${status === 'error' ? 'sds-tl-drop--error' : ''} ${className}`} {...rest}>
        <div className="sds-tl-drop__filerow">
          <Icon name={status === 'error' ? 'bell-alert' : status === 'done' ? 'check-circle' : 'document-text'} size={18}
            className={`sds-tl-drop__fileicon sds-tl-drop__fileicon--${status}`} />
          <div className="sds-tl-drop__fileinfo">
            <span className="sds-tl-drop__filename">{file ? file.name || file : 'File'}</span>
            {status === 'uploading' && <span className="sds-tl-drop__filemeta">Uploading… {progress}%</span>}
            {status === 'done' && <span className="sds-tl-drop__filemeta">Ready</span>}
            {status === 'error' && <span className="sds-tl-drop__filemeta sds-tl-drop__filemeta--error">{error || 'Something went wrong. Try again.'}</span>}
          </div>
          <button type="button" className="sds-iconbtn sds-iconbtn--sm" aria-label="Remove file" onClick={clear}><Icon name="x-mark" size={16} /></button>
        </div>
        {status === 'uploading' && (
          <div className="sds-tl-drop__track"><div className="sds-tl-drop__bar" style={{ width: `${progress}%` }} /></div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`sds-tl-drop ${drag ? 'sds-tl-drop--drag' : ''} ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files && e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current && inputRef.current.click()}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current && inputRef.current.click(); } }}
      {...rest}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => take(e.target.files && e.target.files[0])} />
      <Icon name="arrow-down-tray" size={22} className="sds-tl-drop__icon" />
      <span className="sds-tl-drop__label">Drop a file here or <span className="sds-tl-drop__browse">browse</span></span>
      {hint && <span className="sds-tl-drop__hint">{hint}</span>}
    </div>
  );
}
