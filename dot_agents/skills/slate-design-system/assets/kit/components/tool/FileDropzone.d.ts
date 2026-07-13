import type { ReactNode } from 'react';

export interface FileDropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string;
  /** e.g. "CSV up to 10 MB". */
  hint?: ReactNode;
  /** Controlled state; omit to let the component simulate an upload. */
  status?: 'idle' | 'uploading' | 'done' | 'error';
  progress?: number;
  error?: ReactNode;
  file?: File | string | null;
  onFile?: (file: File) => void;
  onClear?: () => void;
  /** Simulate progress locally when uncontrolled (default true). */
  simulate?: boolean;
}
export function FileDropzone(props: FileDropzoneProps): JSX.Element;
