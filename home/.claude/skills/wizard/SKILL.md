---
name: wizard
description: Build an interactive bash script that walks Brandon step by step through a manual procedure only a human can do. Use for provisioning infrastructure, credentials and CI secrets setup, unfamiliar third-party dashboards, or one-off migrations and cutovers. Not for steps the agent can perform itself.
---

# Wizard

A wizard is a bash script that walks Brandon through a manual procedure that's tedious to do by hand and tedious to re-explain every time: it opens or prints each URL, says exactly what to click and copy, captures the values, writes them where they belong, confirms at every stage, and shows how many stages are left. Ephemeral by default: saved to a scratch or `scripts/` path, deleted when the job's done. Commit it only if it's a repeatable setup path the repo should keep.

## 1. Scope the procedure

Work out every manual step and every value captured along the way. Read the repo first, don't ask cold: `.env.example` and the code and config that reference env vars (never the real `.env` files, which hold values), the README, `docker-compose*`, framework config, and `.github/workflows/*` (every `secrets.*` / `vars.*` reference is a value the wizard must produce). For a migration: current state, target state, and the irreversible actions between them.

Show Brandon the ordered stage list and the values each produces, and let him add, drop, or reorder before you write anything.

## 2. Map each stage's journey

For each stage, write the precise path a human follows: which URL to open, what to click, where the value is shown ("Dashboard → Developers → API keys → Reveal test key → copy"). Where you don't actually know the current UI or exact command, say so and check the docs or ask; never invent steps that may not exist.

## 3. Author the script

Requirements for the script itself:

- One stage per screen: `clear` between stages, a `Stage N of M` header, and the stage's instructions printed fresh so nothing needed scrolls away.
- Show each URL before asking for the value it leads to. On a machine Brandon sits at, open it (`open` on macOS, `xdg-open` fallback). When `~/.config/agent/machine.md` exists, the machine is remote or headless and a browser opened there is invisible to him: print the URL instead.
- Secrets never pass through chat or the terminal echo. When T3's `request_secret` tool is available, collect each secret with it (`delivery: "file"`) and pass the returned file straight to the command that stores it (`gh secret set NAME < "$file"`, or the script's write step with the path as an argument) instead of prompting. Otherwise `read -s`, echoing nothing back.
- Idempotent `.env` writes: update the key if it exists, append if not, never duplicate.
- `gh secret set` / `gh variable set` only for values CI actually references, with names exactly matching the workflow's `secrets.*` references.
- An explicit y/N confirm gate before anything irreversible.
- A closing summary of every value captured and where it was written. Secrets appear by name and destination only, never their values.

## 4. Verify and hand off

`bash -n` the script (and `shellcheck` if available), `chmod +x` it. Don't run it end to end yourself; it opens browsers and blocks on human input. Trace it statically instead: every value from step 1 is captured and lands where step 1 said. Then tell Brandon how to run it.
