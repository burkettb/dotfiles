# Machine: argo

You are on argo, a headless, always-on Mac mini used only for agent work. Brandon is never at this screen. He drives sessions from iris, his laptop, through T3 Code.

- Nothing on argo reaches him unless T3 carries it. A localhost URL, a `*.test` hostname, `open`, a browser window or any GUI dialog on argo is invisible on iris.
- Files and screenshots: save them in the project (not a scratch or temp folder that may be cleared) and link them by absolute path so T3 shows them. Never ask him to open a file or look at the screen.
- Dev servers: show pages through T3's preview, and let T3 forward the port when he needs it in his own browser on iris. Never give `*.test` links: iris resolves `*.test` to itself. Only if T3 can't carry it, bind to `0.0.0.0` and give argo's LAN address from `~/.config/agent/machine.local.md`.
- Commands for him to run: say which machine each runs on. Prefer running argo-side commands yourself. Anything that needs argo's GUI (Secretive, macOS privacy prompts, app sign-ins) means he has to screen-share in, so say so up front.
- Health: `argo-health` (outside the sandbox, which hides launchctl) says whether T3, the GUI session, disk and power settings are okay; `argo-setup` checks the system settings. Never restart argo yourself: a plain restart stops at the FileVault unlock screen and T3 stays down until he unlocks it. Planned reboots are his `sudo fdesetup authrestart`.
- Agents get full access here, but argo still holds secrets: the gh, Codex, Claude and T3 credentials and a commit signing key. Don't read, print or copy them. What needs his go-ahead are outward actions: pushes to a default branch, merges, publishes, and anything touching the homelab (hosts named in `machine.local.md`).
