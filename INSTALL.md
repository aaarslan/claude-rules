# Install and use

Five minutes. You place the directory in your repository, add one block to your
own instructions file, and let the router do the rest.

## 1. Put the corpus in your repository

Pick one. All three work; they differ only in how you take updates.

**Submodule** (clean updates, separate history):

    git submodule add https://github.com/aaarslan/claude-rules agent-rules

**Subtree** (no submodule mechanics for your contributors):

    git subtree add --prefix agent-rules https://github.com/aaarslan/claude-rules main --squash

**Plain copy** (simplest, update by re-copying):

    git clone --depth 1 https://github.com/aaarslan/claude-rules agent-rules
    rm -rf agent-rules/.git

The directory name is yours; `agent-rules/` is used below. Treat it as
read-only: your own rules belong in your repository, not in here.

## 2. Point your instructions at the router

Add this to your root `AGENTS.md`, creating it if absent. Append the block; keep
whatever instructions you already have.

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

Edit two lines: the **profile** (`prototype`, `standard`, or `regulated`) and the
**contexts** that match your stack, chosen from `agent-rules/contexts/`. List
only what your repository actually uses. If none fit, copy
`agent-rules/contexts/_template.md` into your own repository and fill it in from
verified commands.

**Claude Code** also needs a root `CLAUDE.md` containing:

    @AGENTS.md
    @agent-rules/AGENTS.md

**Codex CLI and Codex Cloud** read `AGENTS.md` directly; nothing further.

## 3. Verify the wiring

    node agent-rules/tools/validate-system.mjs

Then ask your agent, in a scratch session: *"What engineering rules are in your
context right now?"* It should name the router, your profile, and the contexts
you declared. If it names nothing, the pointer is not being followed; see
troubleshooting below.

## 4. Let an agent finish the integration (optional)

Point your agent at `agent-rules/ADOPT.md` and ask it to integrate the corpus.
It will detect your stack from manifests and lockfiles, select contexts from
that evidence, and report what it changed. This is the recommended path for
repositories with several languages, or for a polyrepo where each root is
integrated independently.

## Troubleshooting

**The agent ignores the rules.** Some agents treat a prose pointer as
documentation rather than instruction. This is measured, not hypothetical. Wire
the mechanical delivery hook: see the `route-hook.mjs` section of
[tools/README.md](tools/README.md), which injects the routed files directly for
Claude Code via `UserPromptSubmit`.

**The agent loads too much.** The router is meant to load a small subset. If it
is reading everything, your host block probably declares too many contexts, or
declares none and leaves the agent to guess. Name your contexts explicitly.

**Rules conflict with your project's conventions.** Yours win. That is what
"Host rules override it" in the block means. The exceptions are the correctness,
security, and data-integrity priorities, which exist to be non-negotiable.

**A rule is wrong for your work.** Do not edit files inside `agent-rules/`;
updates will overwrite you. Put the override in your own `AGENTS.md`.

## Updating

    git submodule update --remote agent-rules      # submodule
    git subtree pull --prefix agent-rules <url> main --squash   # subtree

Re-run `validate-system.mjs` afterwards; confirm your profile and context paths
still exist.
