#!/usr/bin/env bash
# Per-fixture metadata for assemble-run.sh: source directory, the canonical
# contexts the host block declares, the working profile, and whether the fixture
# holds sibling project roots that must each become their own repository.
#
# Contexts are declared only where a fixture's technology is unambiguous from
# its own files; a fixture whose stack the router should infer declares none.
# Profiles follow the scenario files, which are the authority.
#
# Usage: fixture_meta <id>   -> sets SRC, CONTEXTS, PROFILE, ROOTS, ROOT_CONTEXTS
#
# shellcheck disable=SC2034  # every variable here is read by the caller
# shellcheck disable=SC2016  # context strings carry literal backticks

BACKEND='`agent-rules/contexts/backend-api.md`'
WEB='`agent-rules/contexts/web-ui.md`'
NONE='none preselected; select from evidence per the router'

fixture_meta() {
  local id="$1"
  SRC="$FIXTURES/$id"; CONTEXTS="$NONE"; PROFILE=standard; ROOTS=""; ROOT_CONTEXTS=""
  case "$id" in
    # Each sibling root declares only its own context: they are integrated
    # independently, so neither inherits the other's stack.
    s01) SRC="$FIXTURES/s01-polyrepo"; CONTEXTS="$BACKEND, $WEB"
         ROOTS="accounts-api accounts-web"
         ROOT_CONTEXTS="accounts-api=$BACKEND accounts-web=$WEB" ;;
    s02) SRC="$FIXTURES/s02-upload-prototype"; CONTEXTS="$WEB"; PROFILE=prototype ;;
    s03) SRC="$FIXTURES/s03-widget-client"; CONTEXTS="$BACKEND" ;;
    s04) SRC="$FIXTURES/s04-scaffold-cleanup"; CONTEXTS="$WEB"; PROFILE=prototype ;;
    s05) SRC="$FIXTURES/s05-narrow-bug"; CONTEXTS="$BACKEND" ;;
    s06) SRC="$FIXTURES/s06-order-states"; CONTEXTS="$BACKEND" ;;
    s07) SRC="$FIXTURES/s07-failed-verification"; CONTEXTS="$BACKEND" ;;
    s08) SRC="$FIXTURES/s08-reporting-api"; CONTEXTS="$BACKEND" ;;
    s09) SRC="$FIXTURES/s09-notifications"; CONTEXTS="$BACKEND" ;;
    s10p) SRC="$FIXTURES/s10-measurements-prototype"; CONTEXTS="$BACKEND"; PROFILE=prototype ;;
    s10r) SRC="$FIXTURES/s10-measurements-regulated"; CONTEXTS="$BACKEND"; PROFILE=regulated ;;
    s11) SRC="$FIXTURES/s11-cart"; CONTEXTS="$WEB" ;;
    s12) SRC="$FIXTURES/s12-contacts"; CONTEXTS="$WEB" ;;
    s13) SRC="$FIXTURES/s13-checkout-incident"; CONTEXTS="$BACKEND" ;;
    s14) SRC="$FIXTURES/s14-records"; CONTEXTS="$BACKEND" ;;
    empty) SRC=""; CONTEXTS="$NONE" ;;
    *) echo "unknown fixture: $id" >&2; return 1 ;;
  esac
  if [ -n "$SRC" ] && [ ! -d "$SRC" ]; then
    echo "fixture directory missing: $SRC" >&2
    return 1
  fi
}
