# Python checks

Use the repo's tool: `uv` when there's a `uv.lock`, otherwise poetry, pip-tools or plain pip. Prefer `uv run` so nothing gets installed globally. A local `.venv` is allowed.

- **python.tests**: Run `uv run pytest -q`, or the repo's test command. Finding: failures. Severity: high.
- **python.runtime**: Check `requires-python`, `.python-version` and CI. Finding: an EOL Python (as of 2026-11, 3.10 and older; check endoflife.date when online), or local and CI disagreeing. Severity: medium.
- **python.audit**: Audit the locked set, not the environment. With uv, run `uv export --format requirements-txt --no-hashes -o "$TMPDIR/req.txt"`, then `uvx pip-audit -r "$TMPDIR/req.txt"`. Otherwise run `uvx pip-audit -r requirements.txt`. Finding: advisories that have a fixed version. One ticket listing the packages and fixed versions. Severity: high for critical, otherwise medium.
- **python.outdated**: Run `uv pip list --outdated` or `pip list --outdated`. Finding: a direct dependency two or more majors behind. Otherwise one rollup only when more than 10 are behind. Severity: low or medium.
- **python.lint**: Run `uvx ruff check` with the repo's config, or the defaults. Finding: only bug-class rules (`F`, `B`, `E9`, `PLE`). Severity: medium for undefined names and bare excepts on core paths, otherwise low.
- **python.types**: Only when the repo already uses mypy or pyright, run it. Finding: errors on the default branch. Severity: medium. Don't introduce type checking as a finding.
- **python.files**: Judgment for scripts that move, rename or delete files, or write to user data. Finding: no dry-run path, no guard against overwriting, or paths built from unsanitized input. Severity: high.
