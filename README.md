# Brandon's Dotfiles

macOS development environment for three Macs. `home/` mirrors `$HOME`, and
`install.sh` symlinks each file into place from `~/.dotfiles`, the live copy.
Nobody edits `~/.dotfiles`: every change goes through a branch and PR in a
second clone, `~/dev/dotfiles`. After a merge, every Mac shows that it's behind
main within 15 minutes, and nothing changes until you review the new commits
and run `dotsync --apply` there. Run `dotsync --install-agent` once per Mac to
start the background check.

## New machine setup

```bash
# 1. Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. SSH: brew install --cask secretive, create a key in it, add the public key
#    to GitHub (as auth and signing key), then in ~/.ssh/config:
#      Host *
#        IdentityAgent ~/Library/Containers/com.maxgoedjen.Secretive.SecretAgent/Data/socket.ssh
#        IdentityFile ~/.ssh/<key>.pub
#        IdentitiesOnly yes

# 3. Clone and link
git clone git@github.com:burkettb/dotfiles.git ~/.dotfiles
~/.dotfiles/install.sh

# 4. Install apps and tools
brew bundle --global
brew bundle --file ~/.dotfiles/Brewfile.optional   # optional: pick per machine, see its header

# 5. Install tmux plugin manager, then prefix + I inside tmux
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# 6. Install the managed agent plugins and verify the setup
agent-bootstrap
agent-doctor

# 7. Install node (and anything else in ~/.config/mise/config.toml)
mise install
```

## Moving a machine off chezmoi

```bash
cd ~/.dotfiles && git pull
# Replaces chezmoi's copies with links; anything that differed is moved to
# ~/.dotfiles-backup/<timestamp>/. Cleanup only runs if every link checks out.
./install.sh && ./install.sh --check &&
  brew uninstall chezmoi && rm -rf ~/.config/chezmoi ~/.tmux-sessionizer-dirs
```

Never run `chezmoi apply` after pulling this layout.

## Daily usage

| Task | Command |
| --- | --- |
| Edit, add, rename or delete a dotfile | On a branch in `~/dev/dotfiles/home/`, then a PR. Never in `~/.dotfiles` or through a link like `~/.zshrc` |
| Start the background check (once per Mac) | `dotsync --install-agent`. A LaunchAgent fetches main every 15 minutes and never applies anything; `dotsync --uninstall-agent` removes it |
| See what needs attention | The tmux status bar (e.g. `dotfiles ↓2`, empty when all is well), every new terminal, every new Claude session, or `dotfiles-status`: commits behind main, links to update, uncommitted edits, a non-main branch, fetches failing |
| Apply merged changes | The status line names the commit: review `git -C ~/.dotfiles log -p HEAD..<sha>` (or ask an agent if it's safe), then `dotsync --apply <sha>`. It fast-forwards to that commit, then fixes links, and refuses to touch anything off main, with uncommitted edits, or with local commits. Without `<sha>` it applies whatever was last fetched |
| Check GitHub now | `dotsync` or `prefix u` in tmux: fetches and lists what's waiting, changes nothing. Fetches and failures are logged in `~/.local/state/dotfiles/sync.log` |
| Check every link is in place | `~/.dotfiles/install.sh --check` |
| Install/repair agent plugins | `agent-bootstrap` |
| Verify agent configuration | `agent-doctor` |

## Machine differences

Three Macs share this repo: iris (laptop), argo (headless Mac mini where agents
run) and the work laptop. Each Mac names itself in an untracked
`~/.config/dotfiles/host` (one line, e.g. `argo`), written by
`./install.sh --host <name>`. The name is not detected, because inside the agent
sandbox `scutil --get LocalHostName` returns something else. With no host file,
`install.sh` links `home/` only and says so.

`hosts/<name>/` mirrors `$HOME` like `home/` and is linked after it, file by file.
Host files only add: `install.sh` refuses, before changing anything, when a path
is in both `home/` and `hosts/<name>/` or lands inside a folder `home/` links
whole. Everything else that differs lives in untracked files or skips itself
when a folder doesn't exist:

| What | Where |
| --- | --- |
| git email | GitHub noreply address in the shared `.gitconfig`. Work repos under `~/dev-icfcorp` get the work email from an untracked `~/.gitconfig-icfcorp` on the work Mac |
| Commit signing | On everywhere, through Secretive. Each Mac's key is its own: `[user] signingkey = ~/.ssh/<key>.pub` in `~/.gitconfig.local` (`install.sh` carries it over from an old `~/.gitconfig`), and its public key goes in `home/.config/git/allowed_signers`. No key: `[commit] gpgsign = false` there instead |
| Other machine-only git settings | `~/.gitconfig.local` (untracked, optional) |
| Work-only shell setup, secrets | `~/.shell_local`, sourced at the end of `.shell_common` |
| Templates for those two | `seeds/examples/gitconfig.local.example` and `shell_local.example` (env var names, no values). Not linked; `install.sh --check` mentions a missing `~/.gitconfig.local` or `~/.shell_local` as info |
| tmux-sessionizer folders | Roots that don't exist are skipped; override with `TMUX_SESSIONIZER_ROOTS` in `~/.shell_local` |
| Apps that vary by machine | Pick from `Brewfile.optional`, run by hand |
| Codex config | `~/.codex/config.toml`, seeded once from `seeds/` |
| What agents should know about this machine (headless, reached remotely) | `hosts/<name>/.config/agent/machine.md`, plus an untracked `~/.config/agent/machine.local.md` for what a public repo shouldn't hold (LAN addresses, homelab host names). A Claude `SessionStart` hook prints both; Codex is told to read machine.md |
| Which checks `agent-doctor` runs | `hosts/<name>/.config/agent/profile`: `workspace` (the default) or `agent-box`, or `agent-doctor --profile <name>` |
| Agent box (full-access agents, no Seatbelt sandbox) | `sudo cp seeds/claude-agent-box.json "/Library/Application Support/ClaudeCode/managed-settings.json"`, and in `~/.codex/config.toml` replace `default_permissions = "safe-workspace"` with `sandbox_mode = "danger-full-access"`. Managed settings outrank `~/.claude/settings.json` and are root-owned, but with the sandbox off nothing stops an agent from editing `~/.claude/settings.json` and `hooks/` themselves, so the deny rules and guard hook there are advice, not a wall. Not installed on argo yet, pending a decision |

## argo

argo is the always-on Mac mini where agents run. FileVault is on and auto-login
is off, so every restart waits at the unlock screen, and T3 (a LaunchAgent) only
starts once the GUI session is logged in. Two commands, linked on argo only:

- `argo-setup` checks the settings that keep argo reachable (no sleep, restart
  after power loss, Remote Login, no automatic macOS installs, FileVault and
  authrestart, T3 service, dotsync agent, `agent-doctor --profile agent-box`).
  `argo-setup --apply` fixes what it can and prints each `sudo` command first.
- `argo-health` says whether argo is okay right now; exit 1 means a `FAIL` line.
  From iris: `ssh argo .local/bin/argo-health` (a bare ssh command has no
  `~/.local/bin` on PATH).

**After a power loss** argo powers back on by itself and waits at the unlock
screen. On macOS 26+ with Apple silicon, FileVault unlocks over SSH when Remote
Login is on and argo is on Ethernet or a known WPA2 Wi-Fi network
([Apple](https://support.apple.com/guide/deployment/intro-to-filevault-dep82064ec40/web)).
From iris, on the LAN:

```bash
ssh -o PubkeyAuthentication=no argo   # argo's login password; the disk is locked, so no key works yet
# no shell: macOS drops the connection while it mounts the disk and starts services
ssh argo .local/bin/argo-health
```

If argo-health says no one is logged in to the GUI, screen share in from iris
(`open vnc://argo`), log in, and rerun it. Screen Sharing only starts once the
disk is unlocked, so if the SSH unlock itself fails, someone has to be at argo.

**Planned reboot**: `sudo fdesetup authrestart` on argo, never a plain `reboot`.
It unlocks FileVault once for the next boot. Confirm with argo-health after.

**macOS updates** don't install on their own (an unattended restart would strand
argo at the unlock screen). Install them yourself; if one restarts argo, unlock
it over SSH as above.

**Fresh argo**, in order:

```bash
# 1. Homebrew, as in New machine setup
# 2. HTTPS, since there is no SSH key yet
git clone https://github.com/burkettb/dotfiles.git ~/.dotfiles
~/.dotfiles/install.sh --host argo
brew bundle --global
# 3. Install T3 Code, then
argo-setup            # what's off
argo-setup --apply    # asks for the sudo password
# 4. Screen share in: create the Secretive key (GitHub auth + signing key,
#    allowed_signers, ~/.gitconfig.local), then switch the remote to SSH
git -C ~/.dotfiles remote set-url origin git@github.com:burkettb/dotfiles.git
# 5. Sign in to T3, then the agent plugins and the agent-box permissions
#    (the Agent box row in Machine differences)
agent-bootstrap
# 6. Rerun until every line is ok
argo-setup
```

## What's here

| Repo path | Linked to | Notes |
| --- | --- | --- |
| `home/.zshrc`, `home/.zprofile` | `~/.zshrc` etc. | zsh |
| `home/.shell_common` | `~/.shell_common` | shared env/aliases/functions (bash+zsh) |
| `home/.config/starship.toml` | `~/.config/starship.toml` | prompt |
| `home/.config/mise/` | `~/.config/mise` | global tool versions (node); projects override with `mise.toml` or `.nvmrc` |
| `home/.gitconfig`, `home/.gitignore_global` | `~/.gitconfig` etc. | git |
| `home/.tmux.conf` | `~/.tmux.conf` | tmux |
| `home/.config/nvim/` | `~/.config/nvim` | Neovim 0.12, one `init.lua`, plugins via built-in `vim.pack` |
| `home/.local/bin/` | `~/.local/bin/*` | tmux-sessionizer and friends, agent bootstrap and health checks |
| `home/.config/atuin/` | `~/.config/atuin` | shell history sync |
| `home/.config/linearmouse/` | `~/.config/linearmouse` | mouse settings |
| `home/.claude/` | `~/.claude/CLAUDE.md`, `settings.json`, `hooks/`, `skills/*` | Claude defaults, permissions, hooks, skills |
| `home/.codex/` | `~/.codex/AGENTS.md` | links back to the Claude file, so both agents share one; skills go to `~/.agents/skills/*` |
| `hosts/<name>/` | `~/...` on that Mac only | see Machine differences |
| `home/.editorconfig` | `~/.editorconfig` | applies to everything under `~` |
| `home/.Brewfile` | `~/.Brewfile` | every machine: `brew bundle --global` |
| `Brewfile.optional` | not linked | per-machine app catalog |
| `seeds/codex-config.toml` | copied once | see Agent configuration |

Folders the repo owns completely (nvim, mise, atuin, linearmouse, each skill) are
linked as whole folders, so new files inside need no `install.sh` run and apps
that save by replacing a file can't break the link. Everything else is linked
file by file, so `~/.claude` and `~/.codex` keep their own runtime files.

## Troubleshooting

- **tmux plugins missing**: install TPM (step 5 above), then `prefix + I`
- **Neovim LSP issues**: `:checkhealth vim.lsp` inside nvim. Language
  servers come from the Brewfile; nvim enables whichever are installed.
- **Neovim plugins**: `:lua vim.pack.update()` updates them; versions are
  pinned in `home/.config/nvim/nvim-pack-lock.json`.
- **A file stopped updating**: an app replaced the link with a copy. Run
  `~/.dotfiles/install.sh --check` to find it, then `~/.dotfiles/install.sh`,
  which moves the copy to `~/.dotfiles-backup/<timestamp>/` and relinks. Diff
  the backup against `~/.dotfiles/home/` and carry anything worth keeping over
  in a PR.

## Agent configuration

The dotfiles repository is the source of truth for global Codex and Claude
instructions, hardened permissions, and plugin declarations. DevCenter remains
the source of truth for per-project memory and standards; its home path is
intentionally machine-local.

`home/.claude/CLAUDE.md` is the one instruction file for both agents.
`home/.codex/AGENTS.md` is a symlink to it, and the few agent-specific lines say
which agent they apply to. A new skill goes in `home/.claude/skills/<name>/`; after
`git add` and `./install.sh` it is linked whole into `~/.claude/skills/<name>` and
`~/.agents/skills/<name>`, the user skill folder Codex reads. Links that older
runs made in `~/.codex/skills` are removed.

`~/.codex/config.toml` is seeded once from `seeds/codex-config.toml`, because the
Codex app rewrites it at runtime with machine-local state (plugin caches, trust
hashes, node_repl paths) that should not be tracked. To re-seed a machine, delete
the file and run `./install.sh`. Claude's `settings.json` is a link, so changes
Claude makes to it show up as a diff here; `agent-doctor` verifies the hardening
keys are present in both. Because that link makes the live permissions and hooks
editable from this repo, settings.json blocks sandboxed writes to them and asks
before Edit/Write touches them; change them in a worktree branch instead. That
block is the sandbox's, so on an agent box with the sandbox off an agent can
still edit them.

Never commit credentials, OAuth state, API keys, or `.env` contents here.
Agent configuration references environment-variable names only. Use Keychain or
`~/.shell_local` for actual values.
