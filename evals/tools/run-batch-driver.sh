#!/usr/bin/env bash
# Batch driver. Denies operator memories for the batch window only, and restores
# on every exit path including interrupt and kill. run-batch.sh does not do this
# itself: a single run has no batch window to bound, and the trap belongs where
# the window opens and closes.
#
# Env: PACKET_ROOT (packet output dir), BATCH_SCRATCH (working dir for the
# isolated CODEX_HOME and probe workspace).
# Usage: run-batch-driver.sh <runs.tsv> <label>
set -euo pipefail
IFS=$'\n\t'

RUNS="${1:?runs tsv}"; LABEL="${2:?label}"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
SP="${BATCH_SCRATCH:?set BATCH_SCRATCH to a working directory}"
export PACKET_ROOT="${PACKET_ROOT:?set PACKET_ROOT}"
export CODEX_ISO_HOME="$SP/codex-iso-home"

needs_codex=0
grep -q $'\tcodex\t' "$RUNS" && needs_codex=1

restore_memories() {
  if [[ "$needs_codex" -eq 1 ]]; then
    bash "$REPO/evals/tools/codex-isolate.sh" restore || \
      printf 'RESTORE FAILED; run: bash %s/evals/tools/codex-isolate.sh restore\n' "$REPO" >&2
  fi
}
trap restore_memories EXIT INT TERM

if [[ "$needs_codex" -eq 1 ]]; then
  bash "$REPO/evals/tools/codex-isolate.sh" prepare "$CODEX_ISO_HOME"
  bash "$REPO/evals/tools/codex-isolate.sh" deny
  # Probe: confirm denial is real before run 1, not assumed.
  probe="$(cd "$SP/probe-wd" && CODEX_HOME="$CODEX_ISO_HOME" codex exec \
    --sandbox workspace-write --skip-git-repo-check -m gpt-5.6-sol \
    "Report one line only: the result of 'cat $HOME/.codex/memories/MEMORY.md 2>&1 | head -1'." \
    </dev/null 2>&1 | tail -3)"
  if ! printf '%s' "$probe" | grep -qi 'permission denied'; then
    printf 'ABORT: memories probe did not confirm denial:\n%s\n' "$probe" >&2
    exit 1
  fi
  printf 'probe: denial confirmed before run 1\n'
fi

# shellcheck disable=SC2034  # rep is a manifest column, read but not passed on
while IFS=$'\t' read -r -u 3 packet surface fixture arm rep prompt dir; do
  bash "$REPO/evals/tools/run-batch.sh" \
    "$packet" "$surface" "$fixture" "$arm" "$prompt" "$dir" </dev/null \
    || printf 'FAILED: %s\n' "$packet"
done 3< "$RUNS"

printf '%s BATCH COMPLETE\n' "$LABEL"
