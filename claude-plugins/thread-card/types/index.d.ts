export type Drift = 'on-track' | 'drifting' | 'done'

export type ThreadCard = {
  goal: string
  done: string[]
  open: string[]
  yourMove: string[]
  read: string[]
  next: string
  drift: Drift
  driftNote: string
  updatedAt: number
  turn: number
}

export type CardStatus = { phase: 'idle' | 'updating' | 'error'; note: string }

// `live` comes from the thread itself after each answer; `summary` from a
// cheap model reading another thread's recent transcript.
export type StoredCard = ThreadCard & { source: 'live' | 'summary' }

export type ThreadRow = {
  id: string
  title: string
  project: string
  cwd: string
  isPinned: boolean
  isRunning: boolean
  isSelf: boolean
  lastActivityAt: number
  pr: string
  link: string
}

export type ThreadsStatus = {
  phase: 'idle' | 'loading' | 'building' | 'error'
  note: string
  done: number
  total: number
}

declare module 'claude-code' {
  interface PluginState {
    'thread-card': {
      card: Shaped<ThreadCard | null>
      status: CardStatus
      contextPercent: number | null
      hiddenFor: string
      turns: number
      selfId: string
      threads: Shaped<ThreadRow[]>
      cards: Shaped<Record<string, StoredCard>>
      threadsStatus: ThreadsStatus
      threadsLoadedAt: number
    }
  }
}
