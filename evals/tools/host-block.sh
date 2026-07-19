#!/usr/bin/env bash
# Write an arm's instruction block into a checkout without destroying host
# instructions the fixture already ships.
#
# Fixtures may carry their own root AGENTS.md with project-critical guidance
# (S10's prototype and regulated variants differ only there). Substituting that
# file would change the non-rule instructions between arms and silently
# invalidate any profile-sensitive comparison, so every arm appends.
#
# Usage: append_block <dest> <<< "block text"
#        write_rules_block <dest> <profile> <contexts>

append_block() {
  local dest="$1" file="$1/AGENTS.md"
  if [ -s "$file" ]; then printf '\n' >> "$file"; fi
  cat >> "$file"
  # Claude reads CLAUDE.md; keep it pointing at the merged host file.
  if [ ! -e "$dest/CLAUDE.md" ]; then printf '@AGENTS.md\n' > "$dest/CLAUDE.md"; fi
}

write_rules_block() {
  local dest="$1" profile="$2" contexts="$3"
  append_block "$dest" <<EOF
## Agent Engineering Rules

Before starting any task, read \`agent-rules/AGENTS.md\` and load the files its task table routes for the current task. Required context, not optional documentation.
Active profile: \`agent-rules/profiles/$profile.md\`.
Active canonical contexts: $contexts; ignore the others.
Project contexts: none.
Treat \`agent-rules/\` as read-only. Host rules override it except the correctness, security, and data-integrity priorities in \`agent-rules/core/priorities.md\`.
EOF
  printf '@AGENTS.md\n@agent-rules/AGENTS.md\n' > "$dest/CLAUDE.md"
}
