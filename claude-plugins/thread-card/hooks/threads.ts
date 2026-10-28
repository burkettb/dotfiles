import { atom, read, update } from 'claude-code'
import type { EngineInterface, McpToolResult } from 'claude-code'

import type { StoredCard, ThreadRow } from '../types'
import { parseCard, summaryPrompt } from './card'

// The engine lists a module's state from the atoms each file declares, so
// register.tsx declares the same ones; same key and shape, same value.
const selfId = atom({ plugin: 'thread-card', key: 'selfId' } as const, '')
const threads = atom({ plugin: 'thread-card', key: 'threads' } as const, [], { shape: 'threads-1' })
const cards = atom({ plugin: 'thread-card', key: 'cards' } as const, {}, { shape: 'cards-1' })
const threadsStatus = atom({ plugin: 'thread-card', key: 'threadsStatus' } as const, {
  phase: 'idle',
  note: '',
  done: 0,
  total: 0,
})
const threadsLoadedAt = atom({ plugin: 'thread-card', key: 'threadsLoadedAt' } as const, 0)

const SERVER = 'ccd_session_mgmt'
const SUMMARY_MODEL = 'haiku'
const EVENTS = 40
const MAX_TRANSCRIPT = 60_000
const STALE_MS = 10 * 60_000

export type SessionJson = {
  sessionId?: unknown
  title?: unknown
  cwd?: unknown
  isRunning?: unknown
  pinned?: unknown
  lastActivityAt?: unknown
  prNumber?: unknown
  prState?: unknown
  link?: unknown
  group?: { name?: unknown } | null
}

const str = (value: unknown): string => (typeof value === 'string' ? value : '')

export function mcpText(result: McpToolResult): string {
  return result.content.map(block => block.text ?? '').join('\n')
}

function json(raw: string): unknown {
  const start = raw.search(/[[{]/)
  if (start < 0) return null
  try {
    return JSON.parse(raw.slice(start))
  } catch {
    return null
  }
}

const isSession = (value: unknown): value is SessionJson => typeof value === 'object' && value !== null

export function projectOf(session: SessionJson): string {
  const group = session.group?.name
  if (typeof group === 'string' && group !== '') return group
  const cwd = str(session.cwd)
  if (cwd.includes('/scratch-workspaces/')) return 'Scratch'

  return cwd.split('/').filter(part => part !== '').pop() ?? 'Other'
}

export function toRow(session: SessionJson, self: string): ThreadRow | null {
  const id = str(session.sessionId)
  if (id === '') return null
  const state = str(session.prState).toLowerCase()
  const pr =
    typeof session.prNumber === 'number' ? `PR #${session.prNumber}${state === '' || state === 'open' ? '' : ` ${state}`}` : ''

  return {
    id,
    title: str(session.title) || 'Untitled thread',
    project: projectOf(session),
    cwd: str(session.cwd),
    isPinned: session.pinned === true,
    isRunning: session.isRunning === true,
    isSelf: id === self,
    lastActivityAt: Date.parse(str(session.lastActivityAt)) || 0,
    pr,
    link: str(session.link),
  }
}

export function isStoredCard(value: unknown): value is StoredCard {
  if (typeof value !== 'object' || value === null) return false
  const fields = value as Record<string, unknown>

  return typeof fields.goal === 'string' && Array.isArray(fields.yourMove) && typeof fields.updatedAt === 'number'
}

// A thread needs a card when it has none, or when it moved on after its card.
export function isStale(row: ThreadRow, stored: StoredCard | undefined): boolean {
  return stored === undefined || row.lastActivityAt > stored.updatedAt + STALE_MS
}

async function fail($: EngineInterface, note: string): Promise<void> {
  await update($, threadsStatus, () => ({ phase: 'error', note: note.slice(0, 160), done: 0, total: 0 }))
}

export async function ownId($: EngineInterface): Promise<string> {
  const known = await read($, selfId)
  if (known !== '') return known
  const result = await $.mcp.call(SERVER, 'get_session', { session_id: 'self' })
  const session = result.isError ? null : json(mcpText(result))
  const id = isSession(session) ? str(session.sessionId) : ''
  if (id !== '') await update($, selfId, () => id)

  return id
}

let isLoading = false

export async function loadThreads($: EngineInterface): Promise<void> {
  if (isLoading) return
  isLoading = true
  try {
    await update($, threadsStatus, () => ({ phase: 'loading', note: '', done: 0, total: 0 }))
    const self = await ownId($)
    const others = await $.mcp.call(SERVER, 'list_sessions', { limit: 100 })
    if (others.isError) {
      await fail($, mcpText(others))
      return
    }
    const mine = await $.mcp.call(SERVER, 'get_session', { session_id: 'self' })
    const listed = json(mcpText(others))
    const sessions = [...(Array.isArray(listed) ? listed : []), mine.isError ? null : json(mcpText(mine))].filter(isSession)
    const rows = sessions
      .map(session => toRow(session, self))
      .filter((row): row is ThreadRow => row !== null)
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.lastActivityAt - a.lastActivityAt)

    const loaded: Record<string, StoredCard> = {}
    for (const row of rows) {
      const value = await $.store.get(`card:${row.id}`)
      if (isStoredCard(value)) loaded[row.id] = value
    }
    const at = await $.clock.now()
    await update($, threads, () => rows)
    await update($, cards, () => loaded)
    await update($, threadsLoadedAt, () => at)
    await update($, threadsStatus, () => ({ phase: 'idle', note: '', done: 0, total: 0 }))
  } catch (error) {
    await fail($, error instanceof Error ? error.message : String(error))
  } finally {
    isLoading = false
  }
}

async function buildCard($: EngineInterface, row: ThreadRow): Promise<boolean> {
  const events = await $.mcp.call(SERVER, 'list_events', { session_id: row.id, limit: EVENTS })
  if (events.isError) return false
  const transcript = mcpText(events).slice(-MAX_TRANSCRIPT)
  const reply = await $.model.complete({
    model: SUMMARY_MODEL,
    prompt: summaryPrompt(row.title, transcript),
    maxTokens: 800,
  })
  if (!reply.isAnswered) return false
  const fields = parseCard(reply.text)
  if (fields === null) return false

  const stored: StoredCard = { ...fields, updatedAt: await $.clock.now(), turn: 0, source: 'summary' }
  await $.store.set(`card:${row.id}`, stored)
  await update($, cards, all => ({ ...all, [row.id]: stored }))

  return true
}

let isBuilding = false

export async function buildCards($: EngineInterface, todo: readonly ThreadRow[]): Promise<void> {
  if (isBuilding || todo.length === 0) return
  isBuilding = true
  let failed = 0
  try {
    for (const [index, row] of todo.entries()) {
      await update($, threadsStatus, () => ({ phase: 'building', note: row.title, done: index, total: todo.length }))
      if (!(await buildCard($, row))) failed += 1
    }
    if (failed > 0) {
      await fail($, `${failed} of ${todo.length} cards couldn't be built`)
    } else {
      await update($, threadsStatus, () => ({ phase: 'idle', note: '', done: 0, total: 0 }))
    }
  } catch (error) {
    await fail($, error instanceof Error ? error.message : String(error))
  } finally {
    isBuilding = false
  }
}

export async function buildMissing($: EngineInterface): Promise<void> {
  const rows = await read($, threads)
  const known = await read($, cards)
  await buildCards(
    $,
    rows.filter(row => !row.isSelf && isStale(row, known[row.id])),
  )
}
