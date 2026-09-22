# Project Documentation

This folder is the source of truth for the project's intent, structure, rules,
design, task status, and history. Read these before starting new work — with
me, with Claude Code, or with any other tool.

| File | What it's for | Read it when... |
|---|---|---|
| `prd.md` | What we're building, for whom, and why | You've forgotten the big picture, or someone new joins |
| `architecture.md` | Tech stack, folder structure, how the pieces connect | You need to know where something lives or how a request flows |
| `rules.md` | Conventions, libraries, gotchas, and file-copying discipline | Before writing any new code — this is the rulebook |
| `design.md` | Colors, fonts, layout principles, shared components | Building or styling any new screen |
| `tasks.md` | Every phase, with a status checkbox | Deciding what to build next, or checking what's done |
| `memory.md` | Decisions made and bugs already hit (with root causes) | Something looks broken — check here before re-debugging from scratch |

## Keeping this up to date

- When a phase finishes, update its checkboxes in `tasks.md`.
- When a real bug gets fixed (not just a typo), add an entry to `memory.md` —
  future debugging sessions should be able to search this file before spending
  time re-diagnosing something that already happened once.
- When a new screen or convention is introduced, update `rules.md` or `design.md`
  so future work stays consistent rather than drifting.
