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

# Adopt Agent Engineering Rules

Use this after importing the directory by submodule, subtree, or copy. Keep the import read-only and host-specific material in the host.

## Integrate

1. Resolve the host root from VCS or the nearest manifest/build owner; record ambiguity.
2. Find this directory's path relative to that root; do not assume its name.
3. Detect technologies from manifests, lockfiles, build files, source, configuration, and agent instructions.
4. Choose matching contexts from [AGENTS.md](AGENTS.md). For uncovered stacks, copy [the template](contexts/_template.md) to a host-owned path and fill it from verified commands and APIs.
5. Use the [router precedence](AGENTS.md#route-the-task). Preserve explicit profiles; otherwise use `standard`. Do not infer regulatory obligations from industry labels.
6. Update the host root's `AGENTS.md` with the block below while preserving existing instructions. Integrate separate Git roots independently unless shared policy is requested.
7. For Claude Code, add `@AGENTS.md` and `@<path>/AGENTS.md` to the host's `CLAUDE.md`. If routed files are skipped, wire `<path>/tools/route-hook.mjs` per `<path>/tools/README.md`.
8. Use existing enforcement for hard requirements. Do not add infrastructure only for adoption.

```markdown
## Agent Engineering Rules

Before starting any task, read `<path>/AGENTS.md` and load the files its task table routes for the current task. Required context, not optional documentation.
Active profile: `<path>/profiles/<profile>.md`.
Active canonical contexts: `<paths from <path>/contexts/>`; ignore the others.
Project contexts: `<host paths, or none>`.
Treat `<path>/` as read-only. Host rules override it except the correctness, security, and data-integrity priorities in `<path>/core/priorities.md`.
```

## Verify and report

Run `node <path>/tools/validate-system.mjs`; verify pointers from the host root and confirm the import is unmodified. For supported web/TypeScript hosts, `bash <path>/tools/slop-scan.sh <host-root>` supplies warnings, not proof.

Report the host root, import method, technology evidence, profile, contexts, changed host files, enforcement gaps, and uncertainty.

Update through the original import method, rerun validation, and recheck profile/context paths. Never merge host-specific changes into the import.
