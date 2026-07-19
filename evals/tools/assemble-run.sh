#!/usr/bin/env bash
# Assemble a disposable evaluation checkout for one run.
# Usage: assemble-run.sh <A|B|C|D> <fixture-id> <destination>
# Fixture ids and their contexts/profiles live in fixture-meta.sh.
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "usage: $0 <A|B|C|D> <fixture-id> <destination>" >&2
  exit 1
fi
ARM="$1"; FIXTURE="$2"; DEST="$3"
HERE="$(cd "$(dirname "$0")" && pwd)"
RULES_ROOT="$(cd "$HERE/../.." && pwd)"

# shellcheck source=fixture-meta.sh
# shellcheck disable=SC2034  # consumed by fixture_meta in fixture-meta.sh
FIXTURES="$RULES_ROOT/evals/fixtures"
. "$HERE/fixture-meta.sh"
fixture_meta "$FIXTURE"

if [ -e "$DEST" ]; then
  echo "destination exists: $DEST" >&2
  exit 1
fi
mkdir -p "$DEST"
if [ -n "$SRC" ]; then
  cp -R "$SRC/." "$DEST/"
fi

emit_kernel() { awk 'body { print } /^---$/ { body = 1 }' "$RULES_ROOT/evals/arms/kernel-c.md"; }
emit_paragraph() { sed -n 's/^> \{0,1\}//p' "$RULES_ROOT/evals/arms/paragraph-d.md"; }

case "$ARM" in
  A)
    : # no rules of any kind
    ;;
  B)
    mkdir "$DEST/agent-rules"
    # CHANGELOG.md and README.md are excluded: they narrate this effort.
    for item in AGENTS.md CLAUDE.md ADOPT.md core workflow design architecture quality contexts profiles agents .agents tools; do
      cp -R "$RULES_ROOT/$item" "$DEST/agent-rules/$item"
    done
    cat > "$DEST/AGENTS.md" <<EOF
## Agent Engineering Rules

Before starting any task, read \`agent-rules/AGENTS.md\` and load the files its task table routes for the current task. Required context, not optional documentation.
Active profile: \`agent-rules/profiles/$PROFILE.md\`.
Active canonical contexts: $CONTEXTS; ignore the others.
Project contexts: none.
Treat \`agent-rules/\` as read-only. Host rules override it except the correctness, security, and data-integrity priorities in \`agent-rules/core/priorities.md\`.
EOF
    printf '@AGENTS.md\n@agent-rules/AGENTS.md\n' > "$DEST/CLAUDE.md"
    mkdir -p "$DEST/.claude"
    cat > "$DEST/.claude/settings.json" <<'EOF'
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/agent-rules/tools/route-hook.mjs\" 1" },
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/agent-rules/tools/route-hook.mjs\" 2" },
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/agent-rules/tools/route-hook.mjs\" 3" },
          { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/agent-rules/tools/route-hook.mjs\" 4" }
        ]
      }
    ]
  }
}
EOF
    ;;
  C)
    emit_kernel > "$DEST/AGENTS.md"
    cp "$DEST/AGENTS.md" "$DEST/CLAUDE.md"
    ;;
  D)
    emit_paragraph > "$DEST/AGENTS.md"
    cp "$DEST/AGENTS.md" "$DEST/CLAUDE.md"
    ;;
  *)
    echo "unknown arm: $ARM" >&2
    exit 1
    ;;
esac

if [ -n "$ROOTS" ]; then
  # shellcheck source=polyrepo-init.sh
  . "$HERE/polyrepo-init.sh"
  polyrepo_init "$DEST" "$ARM" "$ROOTS" "$ROOT_CONTEXTS"
  echo "assembled: $DEST (arm $ARM, fixture $FIXTURE, roots: $ROOTS)"
  exit 0
fi

git -C "$DEST" init -q
git -C "$DEST" add -A
# Checkout metadata must be experiment-neutral: no arm, fixture, or harness
# tell may be observable from inside a run (e.g., via git log).
git -C "$DEST" -c user.name=dev -c user.email=dev@local commit -q --allow-empty -m "initial import"
echo "assembled: $DEST (arm $ARM, fixture $FIXTURE)"
echo "after the run: git -C $DEST diff > run.diff"
