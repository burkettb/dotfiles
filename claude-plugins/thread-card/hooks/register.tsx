import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { StoredCard, ThreadCard, ThreadRow } from '../types'
import { CONTEXT_WARN, DRIFT_LOOK, ago, ask, bandFor, meterText, parseCard } from './card'
import { buildCards, buildMissing, isStale, loadThreads, ownId } from './threads'

// Bump a shape tag when that value's fields change: it declines what an
// earlier version stored, which outlives a reload. threads.ts declares the
// all-threads atoms too, with the same keys and shapes.
const card = atom({ plugin: 'thread-card', key: 'card' } as const, null, { shape: 'card-1' })
const status = atom({ plugin: 'thread-card', key: 'status' } as const, { phase: 'idle', note: '' })
const contextPercent = atom({ plugin: 'thread-card', key: 'contextPercent' } as const, null)
const hiddenFor = atom({ plugin: 'thread-card', key: 'hiddenFor' } as const, '')
const turns = atom({ plugin: 'thread-card', key: 'turns' } as const, 0)
const threads = atom({ plugin: 'thread-card', key: 'threads' } as const, [], { shape: 'threads-1' })
const cards = atom({ plugin: 'thread-card', key: 'cards' } as const, {}, { shape: 'cards-1' })
const threadsStatus = atom({ plugin: 'thread-card', key: 'threadsStatus' } as const, {
  phase: 'idle',
  note: '',
  done: 0,
  total: 0,
})
const threadsLoadedAt = atom({ plugin: 'thread-card', key: 'threadsLoadedAt' } as const, 0)

const PANE = 'thread-card'
const THREADS = 'all-threads'
const POLL_MS = 5 * 60_000

async function checkpoint($: EngineInterface): Promise<void> {
  try {
    await $.command.run({ command: 'checkpoint' })
  } catch {
    await $.prompt.submit({ text: 'Checkpoint this thread.', asUser: true })
  }
}

// One refresh at a time; a reload starts it over, which only costs a refresh.
let isRefreshing = false

async function refresh($: EngineInterface, answer: string): Promise<void> {
  if (isRefreshing) return
  isRefreshing = true
  try {
    await update($, status, () => ({ phase: 'updating', note: '' }))
    const prev = await read($, card)
    const reply = await $.model.fork({ prompt: ask(prev, answer) })
    if (!reply.isAnswered) {
      const note: string = reply.reason
      await update($, status, () => ({ phase: 'error', note }))
      return
    }
    const fields = parseCard(reply.text)
    if (fields === null) {
      await update($, status, () => ({ phase: 'error', note: 'the reply was not a card' }))
      return
    }
    const fresh: ThreadCard = { ...fields, updatedAt: await $.clock.now(), turn: await read($, turns) }
    await update($, card, () => fresh)
    await update($, status, () => ({ phase: 'idle', note: '' }))
    // Keyed by the app's session id so the all-threads pane finds it.
    const stored: StoredCard = { ...fresh, source: 'live' }
    const key = (await ownId($).catch(() => '')) || (await $.session.id())
    await $.store.set(`card:${key}`, stored)
  } finally {
    isRefreshing = false
  }
}

let poller: Timer | null = null

function pollThreads($: EngineInterface): void {
  if (poller === null) poller = $.clock.every(POLL_MS, () => void loadThreads($))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'card',
      description: 'Open the thread card pane and refresh it from this thread',
    })
    await $.command.register({
      name: 'threads',
      description: "Open the all-threads pane: every open thread's card, grouped by project",
    })
    void $.ui.open({ id: PANE, title: 'Thread' })

    return next(e)
  })

  on('command.run', { command: 'card' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Thread' })
    $.clock.after(0, () => void refresh($, ''))

    return { text: 'Thread card opened, refreshing it now.' }
  })

  on('command.run', { command: 'threads' }, async $ => {
    await $.ui.open({ id: THREADS, title: 'All threads' })
    pollThreads($)
    $.clock.after(0, () => void loadThreads($))

    return { text: 'All threads opened.' }
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (e.agentId !== undefined || e.reason !== 'answer' || isRefreshing) return result

    await update($, turns, count => count + 1)
    const usage = await $.session.usage()
    await update($, contextPercent, () => usage.context.percent ?? null)
    const answer = e.answer
    $.clock.after(0, () => void refresh($, answer))

    return result
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const current = await read($, card)
    const state = await read($, status)
    const percent = await read($, contextPercent)
    const now = await $.clock.now()

    const section = (label: string, items: string[], mark: string, color?: string, isDim?: boolean) =>
      items.length === 0 ? null : (
        <Box key={label} flexDirection="column" marginTop={1}>
          <Text size="caption" weight="semibold" dimColor>
            {label}
          </Text>
          {items.map((item, index) => (
            <Box key={`${label}-${index}`} gap={1}>
              <Text color={color}>{mark}</Text>
              <Box flexShrink={1}>
                <Text dimColor={isDim}>{item}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )

    const meter =
      percent === null ? null : (
        <Box key="meter" gap={1}>
          <Text size="caption" dimColor>
            Context
          </Text>
          <Text color={percent >= CONTEXT_WARN ? 'warning' : 'success'}>{meterText(percent).filled}</Text>
          <Text dimColor>{meterText(percent).empty}</Text>
          <Text size="caption" tabular dimColor>
            {percent}%
          </Text>
        </Box>
      )

    const buttons = (
      <Box key="buttons" marginTop={1} gap={1} flexWrap="wrap">
        <Button key="refresh" label="Refresh" onPress={() => void refresh($, '')} />
        <Button key="checkpoint" label="Checkpoint" onPress={() => void checkpoint($)} />
      </Box>
    )

    if (current === null) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text dimColor>
            {state.phase === 'updating'
              ? 'Reading the thread...'
              : 'The card fills in after the next answer in this thread.'}
          </Text>
          {state.phase === 'error' && <Text color="error">Couldn't build the card: {state.note}</Text>}
          {meter}
          {buttons}
        </Box>
      )
    }

    const look = DRIFT_LOOK[current.drift]

    return (
      <Box flexDirection="column">
        <Text size="heading" weight="semibold">
          {current.goal}
        </Text>
        <Box marginTop={1} gap={2} flexWrap="wrap">
          <Text color={look.color}>● {look.label}</Text>
          {meter}
        </Box>
        {current.driftNote !== '' && <Text dimColor>{current.driftNote}</Text>}
        {section('YOUR MOVE', current.yourMove, '→', 'warning')}
        {section('READ', current.read, '!', 'error')}
        {section('OPEN', current.open, '○')}
        {section('DONE', current.done, '✓', 'success', true)}
        {current.next !== '' && section('NEXT', [current.next], '▸', 'suggestion')}
        <Box marginTop={1}>
          <Text size="caption" dimColor>
            {state.phase === 'updating'
              ? 'Updating...'
              : `Updated ${ago(now - current.updatedAt)}, turn ${current.turn}`}
          </Text>
        </Box>
        {state.phase === 'error' && (
          <Text size="caption" color="error">
            Last update failed: {state.note}
          </Text>
        )}
        {buttons}
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: THREADS }, async ($, e) => {
    const { Box, Text, Button, Link } = $.ui.resolve(e)
    const rows = await read($, threads)
    const known = await read($, cards)
    const live = await read($, card)
    const state = await read($, threadsStatus)
    const loadedAt = await read($, threadsLoadedAt)
    const now = await $.clock.now()

    // This thread's own card is the live one, fresher than anything stored.
    const cardOf = (row: ThreadRow): StoredCard | undefined =>
      row.isSelf && live !== null ? { ...live, source: 'live' } : known[row.id]
    const missing = rows.filter(row => !row.isSelf && isStale(row, known[row.id]))
    const moves = rows.reduce((sum, row) => sum + (cardOf(row)?.yourMove.length ?? 0), 0)
    const waiting = rows.filter(row => (cardOf(row)?.yourMove.length ?? 0) > 0).length

    const groups = new Map<string, ThreadRow[]>()
    for (const row of rows) groups.set(row.project, [...(groups.get(row.project) ?? []), row])
    const latest = (list: ThreadRow[]) => Math.max(...list.map(row => row.lastActivityAt))
    const ordered = [...groups.entries()].sort((a, b) => latest(b[1]) - latest(a[1]))

    const summary =
      state.phase === 'loading'
        ? 'Loading threads...'
        : state.phase === 'building'
          ? `Building cards ${state.done + 1}/${state.total}: ${state.note}`
          : state.phase === 'error'
            ? state.note
            : loadedAt === 0
              ? 'Press Refresh to load your threads.'
              : `Updated ${ago(now - loadedAt)}`

    const threadRow = (row: ThreadRow) => {
      const found = cardOf(row)
      const look = found === undefined ? undefined : DRIFT_LOOK[found.drift]
      const isOld = !row.isSelf && found !== undefined && isStale(row, found)

      return (
        <Box key={`row-${row.id}`} flexDirection="column" marginTop={1}>
          <Box gap={1} flexWrap="wrap">
            <Text color={row.isRunning ? 'claude' : (look?.color ?? 'inactive')}>●</Text>
            {row.link === '' ? (
              <Text weight="medium">{row.title}</Text>
            ) : (
              <Link key={`open-${row.id}`} href={row.link} label={row.title} />
            )}
            {row.isSelf && (
              <Text size="caption" dimColor>
                this thread
              </Text>
            )}
            {row.isPinned && (
              <Text size="caption" dimColor>
                pinned
              </Text>
            )}
            {row.pr !== '' && (
              <Text size="caption" color="merged">
                {row.pr}
              </Text>
            )}
            <Text size="caption" dimColor>
              {row.isRunning ? 'working now' : ago(now - row.lastActivityAt)}
            </Text>
            {isOld && (
              <Text size="caption" color="warning">
                card is older than the thread
              </Text>
            )}
          </Box>
          {found === undefined ? (
            <Box gap={1}>
              <Text size="caption" dimColor>
                No card yet.
              </Text>
              {!row.isSelf && (
                <Button key={`build-${row.id}`} label="Build card" onPress={() => void buildCards($, [row])} />
              )}
            </Box>
          ) : (
            <Box flexDirection="column">
              <Text dimColor>{found.goal}</Text>
              {found.yourMove.map((item, index) => (
                <Box key={`move-${row.id}-${index}`} gap={1}>
                  <Text color="warning">→</Text>
                  <Box flexShrink={1}>
                    <Text>{item}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        <Text size="heading" weight="semibold">
          All threads
        </Text>
        <Text size="caption" color={state.phase === 'error' ? 'error' : undefined} dimColor={state.phase !== 'error'}>
          {rows.length} open, {moves} moves waiting on you across {waiting} threads. {summary}
        </Text>
        <Box marginTop={1} gap={1} flexWrap="wrap">
          <Button key="threads-refresh" label="Refresh" onPress={() => void loadThreads($)} />
          {missing.length > 0 && state.phase !== 'building' && (
            <Button
              key="threads-build"
              label={`Build ${missing.length} missing card${missing.length === 1 ? '' : 's'}`}
              onPress={() => void buildMissing($)}
            />
          )}
        </Box>
        {ordered.map(([project, list]) => (
          <Box key={`group-${project}`} flexDirection="column" marginTop={1}>
            <Text size="caption" weight="semibold" dimColor>
              {project.toUpperCase()} ({list.length})
            </Text>
            {list.map(threadRow)}
          </Box>
        ))}
      </Box>
    )
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    const band = bandFor(await read($, card), await read($, contextPercent))
    if (band === null || (await read($, hiddenFor)) === band.key) return next(e)

    const { Box, Text, Button } = $.ui.resolve(e)

    return (
      <Box gap={1} flexWrap="wrap">
        <Text color="warning">●</Text>
        <Text>{band.text}</Text>
        <Button key="checkpoint" label="Checkpoint" variant="primary" onPress={() => void checkpoint($)} />
        <Button key="hide" label="Hide" onPress={() => update($, hiddenFor, () => band.key)} />
      </Box>
    )
  })
}
