# Phase 0 Round Three: Mechanical Delivery

Run 2026-07-18 at `1d254a5`, with `tools/route-hook.mjs` wired as four `UserPromptSubmit` entries by `assemble-run.sh`. Claude Code only; Codex passed in [round one](P0-SUMMARY.md). Three fresh arm-B checkouts, prompts verbatim from [the runbook](../tools/README.md), model pinned to `claude-fable-5`, user-global memory neutralized.

## Gate verdict: PASS

| Run | Route | R1 | R2 | R3 strict | R3 crediting the import |
| --- | --- | --- | --- | --- | --- |
| S05 | Bug fix | 0/11 | 0/11 | 10/11 (90.9%) | 11/11 (100%) |
| S07 | Bug fix | 0/12 | 0/12 | 11/12 (91.7%) | 12/12 (100%) |
| C01 | Feature | 5/13 | 12/13 | 11/13 (84.6%) | 12/13 (92.3%) |
| **Total** | | **13.9%** | **33.3%** | **32/36 = 88.9%** | **35/36 = 97.2%** |

Both countings clear 80%, so the crediting choice does not affect the verdict. "Strict" counts hook injection plus model reads. The router `AGENTS.md` arrives by `CLAUDE.md` import, which is neither, and is credited in the right-hand column; round two's probe established it is genuinely in context.

Hook stderr was clean on all three runs: no missing files, no chunk overflow. Per instruction, this stops here; Phase 1 is a separate decision.

## Read this before treating the pass as vindication

**The gate now largely measures itself.** The hook injects the routed files and tells the model "they are already fully included below, so do not re-read these files." The model duly read zero rule files in all three runs, so the discretionary signal the gate was built to detect is now zero by construction. Round three demonstrates that mechanical delivery works, not that routing works. The honest reading of the three rounds is that the model never routed on small tasks and still does not; the fix removed the need for it to.

That was the point of the pre-registered fallback, and the gate is passed as written. But the number is no longer a behavioral measurement, and it should not be cited as one.

**One genuine routing gap survives.** `contexts/web-ui.md` was neither injected nor read on C01, the only required-file miss not attributable to import bookkeeping. The hook derives contexts from the host `AGENTS.md` declaration lines, and a greenfield checkout declares "none preselected; select from evidence per the router", so there was nothing to inject and discretion produced nothing. Round two's model-driven C01 did read `contexts/web-ui.md` and `contexts/ui-styling.md`. Mechanical delivery is better on workflow files and worse on greenfield context selection. Phase 2 is five-sixths greenfield, so this matters there more than here.

**Conditional-file reads, the intended residual signal, are unobservable.** No run read any conditional file beyond what was injected, because the injection covered them and the instruction discourages re-reading. S05 received all three of its conditionals; S07 and C01 received several via the Feature superset.

## One behavioral trace worth following

S07's final report ends with an explicit "Skeptic pass" section re-reading the diff for tested branches, other call sites of the changed return shape, and dead code. That is the shape prescribed by `workflow/skeptic-pass.md`, and it appears in the one S07 run where that file was in context; the round-one and round-two S07 runs, both loading zero rule files, produced no such section. Its verification account is also more precise, confirming via `git ls-files` that `data/seed.json` never existed and declining to invent it.

This is the first sign in Phase 0 that a delivered rule changed output. It is one observation against two, one model, no arm-A control. A lead for Phase 1, not a result.

## Covariates across rounds

| Run | R1 | R2 | R3 |
| --- | --- | --- | --- |
| S05 | 40s, 11 calls | 38s, 11 calls, 2.0k tok | 41s, 9 calls, 2.5k tok |
| S07 | 62s, 14 calls | 55s, 14 calls, 2.9k tok | 72s, 16 calls, 3.8k tok |
| C01 | 438s, 36 calls | 546s, 51 calls, 42.3k tok | 200s, 8 calls, 15.0k tok |

C01 cost fell by roughly two thirds against round two while producing a better artifact: three files plus a checked-in `app.test.js`, no framework or build step, and no recurrence of round two's write into read-only `agent-rules/`. Whether that reflects the injected rules or ordinary variance on an open-ended prompt is not separable at n=1. S05 and S07 costs are essentially flat; injected instruction tokens are absorbed by the prompt cache and do not show up in output tokens.

## Isolation, and a deviation from the instruction

`CLAUDE_CONFIG_DIR` isolation could not be used. There is no `~/.claude/.credentials.json` on this machine; Claude Code stores credentials in the macOS Keychain under a service name derived from the config directory (`Claude Code-credentials-<hash>`), so a fresh config directory reports "Not logged in", and reproducing auth there would mean handling credential secrets directly. Isolation was achieved instead with the supported `--setting-sources project,local` flag, which excludes user-level sources while leaving the project `.claude/settings.json` that carries the hook.

Verified by the probe the instruction requires, in a throwaway checkout: the session listed 16 injected rule files plus the imported router, and answered that no text about "Environment Setup", Volta, zsh aliases, or eza appeared in its context. The same probe phrasing in round two reported those global files as present, so the before/after contrast is a controlled one.

Codex globals, recorded for the protocol: `~/.codex/AGENTS.md` exists but is **0 bytes**, and `~/.codex/config.toml` (9127 bytes) contains no `instructions`, `experimental_instructions_file`, or `project_doc` key, only a `notify` hook. Nothing to neutralize on that surface. No Codex runs this round.

## Limitations

One rep per cell across all three rounds, so no variance estimate. One model, one surface. The Feature-superset fall-through means S07 and C01 test over-delivery rather than precise routing. Per decision rule 5, these results support claims only about these scenarios, this model, and this surface.
