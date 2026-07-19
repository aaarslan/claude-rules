#!/usr/bin/env bash
# Execute one evaluated run and package its evidence packet.
# Usage: run-batch.sh <packet> <claude|codex> <fixture> <arm> <prompt> <run-dir>
set -euo pipefail
IFS=$'\n\t'

if [[ $# -ne 6 ]]; then
  printf 'usage: %s <packet> <claude|codex> <fixture> <arm> <prompt> <run-dir>\n' "$0" >&2
  exit 2
fi

packet="$1"; surface="$2"; fixture="$3"; arm="$4"; prompt="$5"; rundir="$6"
HERE="$(cd "$(dirname "$0")" && pwd)"
out="${PACKET_ROOT:?set PACKET_ROOT to the packet output directory}/$packet"

[[ -e "$rundir" ]] && { printf 'refusing to reuse checkout: %s\n' "$rundir" >&2; exit 1; }
mkdir -p "$out" "$(dirname "$rundir")"
bash "$HERE/assemble-run.sh" "$arm" "$fixture" "$rundir" >/dev/null

# Recompute exactly what the hook injects for this prompt (arm B, Claude only).
injected="$out/.injected.txt"; : > "$injected"
if [[ "$arm" == "B" && -f "$rundir/agent-rules/tools/route-hook.mjs" ]]; then
  printf '%s' "$prompt" | node -e '
  let s=""; process.stdin.on("data",(d)=>{s+=d});
  process.stdin.on("end",()=>process.stdout.write(JSON.stringify({prompt:s})));' > "$out/.prompt.json"
  for chunk in 1 2 3 4; do
    ( cd "$rundir" && node agent-rules/tools/route-hook.mjs "$chunk" < "$out/.prompt.json" ) \
      2>> "$out/.hook-stderr.txt" | grep -oE '^===== agent-rules/.*\.md' >> "$injected" || true
  done
  sed -i '' 's|^===== agent-rules/||' "$injected"
  sort -u -o "$injected" "$injected"
fi

# `echo` is allowlisted so runs can capture exit statuses themselves; batch one
# had `cmd; echo "exit: $?"` refused by the permission gate, which suppressed
# exactly the evidence the verification scenarios ask for.
tools=(
  Read Glob Grep Edit Write TodoWrite WebFetch WebSearch
  "Bash(npm:*)" "Bash(npx:*)" "Bash(node:*)" "Bash(git:*)" "Bash(echo:*)"
  "Bash(ls:*)" "Bash(cat:*)" "Bash(find:*)" "Bash(head:*)" "Bash(printf:*)"
  "Bash(tail:*)" "Bash(grep:*)" "Bash(mkdir:*)" "Bash(wc:*)" "Bash(rg:*)"
)

start="$(date +%s)"
# Agent stdin is closed: codex exec appends piped stdin to the prompt.
if [[ "$surface" == "claude" ]]; then
  transcript="$out/transcript.jsonl"
  ( cd "$rundir" && claude -p "$prompt" --model "${CLAUDE_MODEL:-claude-fable-5}" \
      --setting-sources project,local --allowedTools "${tools[@]}" \
      --output-format stream-json --verbose ) \
    < /dev/null > "$transcript" 2> "$out/run-stderr.txt" || true
else
  transcript="$out/transcript.log"
  # CODEX_HOME isolation keeps operator memories out of the feature surface.
  # It does NOT block a hardcoded path read; see the runbook's isolation
  # section for the deny-and-restore wrapper that does.
  ( cd "$rundir" && CODEX_HOME="${CODEX_ISO_HOME:?set CODEX_ISO_HOME}" \
      codex exec --sandbox workspace-write --skip-git-repo-check \
      -m "${CODEX_MODEL:-gpt-5.6-sol}" "$prompt" ) \
    < /dev/null > "$out/stdout.txt" 2> "$transcript" || true
fi
end="$(date +%s)"

git -C "$rundir" add -A
git -C "$rundir" diff HEAD > "$out/run.diff"
git -C "$rundir" status --porcelain > "$out/status.txt"
node "$HERE/package-run.mjs" "$surface" "$transcript" "$out" "$injected" >/dev/null
printf -- '- Wall clock: %ss\n' "$((end - start))" >> "$out/covariates.md"
rm -f "$injected" "$out/.prompt.json"
printf 'done: %s %s/%s (%ss)\n' "$packet" "$surface" "$fixture" "$((end - start))"
