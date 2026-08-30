> [!IMPORTANT]
> This repository is the legacy v0.3 predecessor and evaluation record.
> The maintained project is [Agent Engineering Rules](https://github.com/aaarslan/agent-engineering-rules).
> New installations should use:
>
> ```bash
> npm install --global @aaarslan/aer
> aer init --host claude --dry-run
> aer init --host claude
> ```

# Install and use

Place the directory in your repository, add one block to your instructions file, and let the router do the rest.

## 1. Put the corpus in your repository

Pick one; they differ only in how you take updates.

**Submodule** (clean updates, separate history):

    git submodule add https://github.com/aaarslan/claude-rules agent-rules

**Subtree** (no submodule mechanics for your contributors):

    git subtree add --prefix agent-rules https://github.com/aaarslan/claude-rules main --squash

**Plain copy** (simplest, update by re-copying):

    git clone --depth 1 https://github.com/aaarslan/claude-rules agent-rules
    rm -rf agent-rules/.git

The directory name is yours; `agent-rules/` is used below. Treat it as read-only: your own rules belong in your repository.

## 2. Point your instructions at the router

Add this to your root `AGENTS.md`, creating it if absent. Keep existing instructions.

```markdown
## Agent Engineering Rules

Before starting any task, read `agent-rules/AGENTS.md` and load the files its
task table routes for the current task. Required context, not optional
documentation.
Active profile: `agent-rules/profiles/standard.md`.
Active canonical contexts: `agent-rules/contexts/backend-api.md`; ignore the others.
Project contexts: none.
Treat `agent-rules/` as read-only. Host rules override it except the
correctness, security, and data-integrity priorities in
`agent-rules/core/priorities.md`.
```

Edit the **profile** (`prototype`, `standard`, or `regulated`) and the **contexts** that match your stack. List only what the repository uses. If none fit, copy `agent-rules/contexts/_template.md` into your repository and fill it from verified commands.

**Claude Code** also needs a root `CLAUDE.md` containing:

    @AGENTS.md
    @agent-rules/AGENTS.md

**Codex CLI and Codex Cloud** read `AGENTS.md` directly; nothing further.

## 3. Verify the wiring

    node agent-rules/tools/validate-system.mjs

Then ask in a scratch session: *"What engineering rules are in your context right now?"* It should name the router, profile, and declared contexts. If it names nothing, see troubleshooting below.

## 4. Let an agent finish the integration (optional)

Point your agent at `agent-rules/ADOPT.md`. It will detect the stack from manifests and lockfiles, select contexts from that evidence, and report its changes. Use this for multilanguage repositories or independently integrated polyrepo roots.

## Troubleshooting

**The agent ignores the rules.** Some agents treat a prose pointer as documentation rather than instruction. This is measured. The `route-hook.mjs` section of [tools/README.md](tools/README.md) injects routed files for Claude Code via `UserPromptSubmit`.

**The agent loads too much.** The router should load a small subset. Name contexts explicitly.

**Rules conflict with your project's conventions.** Yours win except the non-negotiable correctness, security, and data-integrity priorities.

**A rule is wrong for your work.** Put overrides in your own `AGENTS.md`; updates overwrite edits inside `agent-rules/`.

## Updating

    git submodule update --remote agent-rules      # submodule
    git subtree pull --prefix agent-rules <url> main --squash   # subtree

Re-run `validate-system.mjs`; confirm profile and context paths still exist.
