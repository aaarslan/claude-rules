#!/usr/bin/env bash
# Prepare an isolated CODEX_HOME and, while a batch runs, deny reads of the
# operator's real memories directory.
#
# Why both: CODEX_HOME redirects the memories feature, but the sandbox still
# permits reading an absolute path under the operator's home, and batch-one runs
# reached the memories file by its literal path, not through $CODEX_HOME. Only
# the filesystem denial actually satisfies "not readable from evaluated runs".
#
# Usage:
#   codex-isolate.sh prepare <iso-home>     # symlink auth, disable memories
#   codex-isolate.sh deny                   # chmod 000 the real memories dir
#   codex-isolate.sh restore                # put its mode back
#   codex-isolate.sh status
set -euo pipefail
IFS=$'\n\t'

MEM="${CODEX_REAL_HOME:-$HOME/.codex}/memories"
MODE_FILE="${TMPDIR:-/tmp}/codex-memories-mode"

case "${1:-}" in
  prepare)
    iso="${2:?usage: codex-isolate.sh prepare <iso-home>}"
    mkdir -p "$iso"
    # Symlink, never copy: no second copy of the credential is created.
    [[ -e "$iso/auth.json" ]] || ln -s "${CODEX_REAL_HOME:-$HOME/.codex}/auth.json" "$iso/auth.json"
    cat > "$iso/config.toml" <<'EOF'
model_reasoning_effort = "max"

[features]
memories = false

[memories]
generate_memories = false
use_memories = false
EOF
    printf 'prepared: %s\n' "$iso"
    ;;
  deny)
    [[ -d "$MEM" ]] || { printf 'no memories dir at %s; nothing to deny\n' "$MEM"; exit 0; }
    # Pre-flight: an interrupted batch can leave a deny in place. Restore it
    # first, so the mode we save is never the denied mode itself. Without this
    # a second deny would record 000 as "previous" and restore would be a no-op
    # that leaves the operator's memories permanently unreadable.
    if [[ -f "$MODE_FILE" ]]; then
      chmod "$(cat "$MODE_FILE")" "$MEM" 2>/dev/null || true
      rm -f "$MODE_FILE"
      printf 'pre-flight: cleared a stale deny before re-applying\n'
    fi
    stat -f '%Lp' "$MEM" > "$MODE_FILE"
    chmod 000 "$MEM"
    printf 'denied: %s (previous mode %s saved)\n' "$MEM" "$(cat "$MODE_FILE")"
    ;;
  restore)
    [[ -f "$MODE_FILE" ]] || { printf 'no saved mode; not touching %s\n' "$MEM" >&2; exit 1; }
    chmod "$(cat "$MODE_FILE")" "$MEM"
    printf 'restored: %s to mode %s\n' "$MEM" "$(cat "$MODE_FILE")"
    rm -f "$MODE_FILE"
    ;;
  status)
    printf 'memories dir: %s\n' "$MEM"
    [[ -d "$MEM" ]] && printf 'current mode: %s\n' "$(stat -f '%Lp' "$MEM")"
    if [[ -f "$MODE_FILE" ]]; then
      printf 'saved mode:   %s (deny is ACTIVE; run restore)\n' "$(cat "$MODE_FILE")"
    else
      printf 'deny is not active\n'
    fi
    ;;
  *)
    printf 'usage: %s <prepare <iso-home>|deny|restore|status>\n' "$0" >&2
    exit 2
    ;;
esac
