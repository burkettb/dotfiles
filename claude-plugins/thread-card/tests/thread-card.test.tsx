import { expect, test } from 'claude-code/testing'
import type { McpToolResult, ModelCompleteResult, ModelForkResult, On } from 'claude-code'

import { bandFor, parseCard } from '../hooks/card'
import { projectOf, toRow } from '../hooks/threads'

const SURFACES = ['terminal', 'desktop', 'vscode', 'mobile'] as const

const PANE = {
  plugin: 'thread-card',
  component: 'Pane',
  requestId: 'thread-card',
  props: {
    title: 'Thread',
    isFocused: false,
    bodyColumns: 48,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const

const THREADS = { ...PANE, requestId: 'all-threads', props: { ...PANE.props, title: 'All threads' } } as const

const BAND = {
  plugin: 'thread-card',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 3,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 3 },
    view: {},
  },
} as const

const REPLY = `Here you go:
\`\`\`json
{"goal": "Fix the CSV bulk upload", "done": ["Parser fixed, pytest green"],
 "open": ["Prod data not checked"], "yourMove": ["Review PR #61"],
 "read": ["Upload rejects rows silently on bad dates"], "next": "Run against the prod dump",
 "drift": "done", "driftNote": "Fix merged and verified"}
\`\`\``

const SUMMARY = JSON.stringify({
  goal: 'Move mail to the new provider',
  yourMove: ['Ask the PM for the cutover date', 'Send the DNS change to the client'],
  drift: 'on-track',
})

const NOW = Date.parse('2026-10-28T12:00:00Z')
const USAGE = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 }

const SELF = {
  sessionId: 'local_self',
  title: 'Claude workflow customization',
  cwd: '/Users/me/.dotfiles',
  lastActivityAt: '2026-10-28T11:59:00Z',
  group: { name: 'Meta' },
  link: 'claude://claude.ai/epitaxy/local_self',
}

const OTHERS = [
  {
    sessionId: 'local_mail',
    title: 'Mail provider migration',
    cwd: '/Users/me/dev/billing',
    lastActivityAt: '2026-10-28T10:00:00Z',
    pinned: true,
    group: { name: 'Billing' },
    link: 'claude://claude.ai/epitaxy/local_mail',
  },
  {
    sessionId: 'local_tab',
    title: 'Settings page access bug',
    cwd: '/Users/me/dev/billing',
    lastActivityAt: '2026-10-27T17:21:00Z',
    prNumber: 59,
    prState: 'OPEN',
    group: { name: 'Billing' },
    link: 'claude://claude.ai/epitaxy/local_tab',
  },
]

// A card that local_tab already has from an earlier summary.
const STORED_TAB = {
  goal: 'Fix settings page access',
  done: [],
  open: [],
  yourMove: ['Merge PR #59 after QA'],
  read: [],
  next: '',
  drift: 'on-track',
  driftNote: '',
  updatedAt: Date.parse('2026-10-27T18:00:00Z'),
  turn: 0,
  source: 'summary',
}

const mcp = (value: unknown, isError = false): McpToolResult => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }],
  isError,
})

// The engine beneath the plugin: each hook answers one call the mod makes.
function engine(
  on: On,
  fork: ModelForkResult = { isAnswered: true, text: REPLY, usage: USAGE },
  complete: ModelCompleteResult = { isAnswered: true, text: SUMMARY, usage: USAGE },
): string[] {
  const stored: string[] = []
  on('model.fork', () => ({ value: fork }))
  on('model.complete', () => ({ value: complete }))
  on('clock.now', () => ({ value: NOW }))
  on('session.id', () => ({ value: 'engine-id' }))
  on('store.get', (_, e) => ({ value: e.key === 'card:local_tab' ? STORED_TAB : undefined }))
  on('store.set', (_, e) => {
    stored.push(e.key)
    return { value: undefined }
  })
  on('mcp.call', (_, e) => {
    if (e.tool === 'get_session') return { value: mcp(SELF) }
    if (e.tool === 'list_sessions') return { value: mcp(OTHERS) }
    if (e.tool === 'list_events') return { value: mcp(`Session "${String(e.args.session_id)}" transcript`) }
    return { value: mcp('unknown tool', true) }
  })
  on('command.run', () => ({ text: '' }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })

  return stored
}

test('a fenced reply parses and its lists are capped', async () => {
  const fields = parseCard(REPLY)
  expect(fields?.goal).toBe('Fix the CSV bulk upload')
  expect(fields?.yourMove).toEqual(['Review PR #61'])
  expect(fields?.drift).toBe('done')

  const long = parseCard(JSON.stringify({ goal: 'g', open: ['1', '2', '3', '4', '5', '6', '7'], drift: 'sideways' }))
  expect(long?.open.length).toBe(5)
  expect(long?.drift).toBe('on-track')
  expect(parseCard('no json here')).toBe(null)
  expect(parseCard('{"done": []}')).toBe(null)
})

test('the band speaks up for a full context first, then for drift', async () => {
  expect(bandFor(null, 40)).toBe(null)
  expect(bandFor(null, 72)?.key).toBe('context-60')
  expect(bandFor(null, 91)?.key).toBe('context-85')
  const card = { ...parseCard(REPLY)!, updatedAt: 0, turn: 1 }
  expect(bandFor(card, 30)?.text).toMatch(/Goal looks done/)
  expect(bandFor({ ...card, drift: 'on-track', driftNote: '' }, 30)).toBe(null)
})

test('a thread files under its sidebar group, else its folder', async () => {
  expect(projectOf({ group: { name: 'Billing' }, cwd: '/x/dev/billing' })).toBe('Billing')
  expect(projectOf({ group: null, cwd: '/Users/me/dev/reports-etl' })).toBe('reports-etl')
  expect(projectOf({ cwd: '/Library/Claude/scratch-workspaces/abc' })).toBe('Scratch')
  expect(toRow(OTHERS[1]!, 'local_self')?.pr).toBe('PR #59')
  expect(toRow({ ...OTHERS[1]!, prState: 'MERGED' }, 'local_self')?.pr).toBe('PR #59 merged')
  expect(toRow({ title: 'no id' }, 'local_self')).toBe(null)
})

test('Refresh fills the pane from the fork, on every surface', async ($, on) => {
  const stored = engine(on)

  const desktop = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await desktop.find({ type: 'Text', text: /fills in/ }))?.text).toMatch(/fills in/)
  await desktop.press({ key: 'refresh' })
  await desktop.unmount()
  // Stored under the app's id, which the all-threads pane looks up.
  expect(stored).toEqual(['card:local_self'])

  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /CSV bulk upload/ }))?.text).toBe('Fix the CSV bulk upload')
    expect((await ui.find({ type: 'Text', text: /Review PR #61/ }))?.text).toBe('Review PR #61')
    expect((await ui.find({ type: 'Text', text: /Goal met/ }))?.text).toBe('● Goal met')
    await ui.unmount()
  }
})

test('a fork with nothing to read shows why on the empty pane', async ($, on) => {
  engine(on, { isAnswered: false, reason: 'nothing-to-fork' })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'refresh' })
  expect((await ui.find({ type: 'Text', text: /Couldn't build/ }))?.text).toMatch(/nothing-to-fork/)
  await ui.unmount()
})

test('the band shows when the goal is met and Hide puts it away', async ($, on) => {
  engine(on)

  const pane = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await pane.press({ key: 'refresh' })
  await pane.unmount()

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await band.find({ type: 'Text', text: /Goal looks done/ }))?.text).toMatch(/Checkpoint before moving on/)
  await band.press({ key: 'hide' })
  await band.unmount()

  const after = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect((await after.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await after.unmount()
})

test('all threads groups by project and lists the moves a card holds', async ($, on) => {
  engine(on)

  const ui = await $.ui.mount({ ...THREADS, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /Press Refresh/ }))?.text).toMatch(/0 open/)
  await ui.press({ key: 'threads-refresh' })
  await ui.unmount()

  for (const surface of SURFACES) {
    const view = await $.ui.mount({ ...THREADS, surface })
    expect((await view.find({ type: 'Text', text: /^BILLING/ }))?.text).toBe('BILLING (2)')
    expect((await view.find({ type: 'Text', text: /^META/ }))?.text).toBe('META (1)')
    expect((await view.find({ type: 'Text', text: /Merge PR #59/ }))?.text).toBe('Merge PR #59 after QA')
    expect((await view.find({ type: 'Text', text: /moves waiting/ }))?.text).toMatch(/^3 open, 1 moves waiting on you across 1 threads/)
    await view.unmount()
  }
})

test('Build missing cards summarizes the threads that have none', async ($, on) => {
  const stored = engine(on)

  const ui = await $.ui.mount({ ...THREADS, surface: 'desktop' })
  await ui.press({ key: 'threads-refresh' })
  await ui.unmount()

  const before = await $.ui.mount({ ...THREADS, surface: 'desktop' })
  // local_mail has no card; local_tab's card is newer than its last activity, so it stays.
  await before.press({ key: 'threads-build' })
  await before.unmount()
  expect(stored).toEqual(['card:local_mail'])

  const after = await $.ui.mount({ ...THREADS, surface: 'desktop' })
  expect((await after.find({ type: 'Text', text: /cutover date/ }))?.text).toBe('Ask the PM for the cutover date')
  expect((await after.find({ type: 'Text', text: /moves waiting/ }))?.text).toMatch(/3 moves waiting on you across 2 threads/)
  await after.unmount()
})
