#!/usr/bin/env bash
# Initialise a fixture whose sibling project roots must stay separate
# repositories, per ADOPT.md's rule that separate Git roots are integrated
# independently. Each root becomes its own repository and the parent becomes
# none, so nothing in the checkout suggests a workspace.
#
# Each root's host block declares only that root's own context, so neither
# sibling inherits the other's stack.
#
# Usage: polyrepo_init <dest> <arm> "<roots>" "<root=context ...>"

init_repo() {
  git -C "$1" init -q
  git -C "$1" add -A
  git -C "$1" -c user.name=dev -c user.email=dev@local \
    commit -q --allow-empty -m "initial import"
}

root_context() {
  local root="$1" pair
  for pair in $2; do
    [ "${pair%%=*}" = "$root" ] && { printf '%s' "${pair#*=}"; return; }
  done
}

polyrepo_init() {
  local dest="$1" arm="$2" roots="$3" pairs="${4:-}" root ctx
  for root in $roots; do
    # Arm B materialises the corpus separately inside each root, which is what
    # independent integration means: one host block per repository.
    if [ "$arm" = B ] && [ -d "$dest/agent-rules" ]; then
      cp -R "$dest/agent-rules" "$dest/$root/agent-rules"
      cp "$dest/AGENTS.md" "$dest/$root/AGENTS.md"
      [ -f "$dest/CLAUDE.md" ] && cp "$dest/CLAUDE.md" "$dest/$root/CLAUDE.md"
      [ -d "$dest/.claude" ] && cp -R "$dest/.claude" "$dest/$root/.claude"
      ctx="$(root_context "$root" "$pairs")"
      if [ -n "$ctx" ]; then
        sed "s|^Active canonical contexts: .*|Active canonical contexts: $ctx; ignore the others.|" \
          "$dest/$root/AGENTS.md" > "$dest/$root/AGENTS.md.tmp"
        mv "$dest/$root/AGENTS.md.tmp" "$dest/$root/AGENTS.md"
      fi
    fi
    init_repo "$dest/$root"
  done
  if [ "$arm" = B ]; then
    rm -rf "$dest/agent-rules" "$dest/.claude" "$dest/AGENTS.md" "$dest/CLAUDE.md"
  fi
}
