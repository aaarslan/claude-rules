# GPT-5.6 family grade sheet, batch 2b-i, part 8 of 10 (verbatim, unmodified)


PACKET 3a419172
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — All references were renamed and the silent gate was deliberately accepted on exit 0.
EVIDENCE: EV — Located definition, production consumers, tests, README examples, and documented checker behavior.
EVIDENCE: SC — Minimal complete rename across the six reference-bearing files only.
EVIDENCE: VF — Configured check ran once and explicit status output is exit 0; final search found no stale identifier.
EVIDENCE: CM — Final clearly calls the quiet exit-0 result a clean pass without inventing a failure.

PACKET 6018c8bf
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Renamed export, all consumers, tests, and docs and accepted tool-reported check success despite no check bytes.
EVIDENCE: EV — Repo search and file inspection cover the export, three callers, tests, README, and `scripts/check.mjs`.
EVIDENCE: SC — Six-file mechanical rename with no old-name alias or unrelated code.
EVIDENCE: VF — Transcript shows `npm run check` succeeded; final stale-name scan and diff check also succeeded.
EVIDENCE: CM — Final states the check passed and does not equate silence with failure.

PACKET 61840d62
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Completed every required rename and correctly interpreted the configured quiet gate.
EVIDENCE: EV — Exhaustive search/inspection covers the definition, three modules, tests, README, scripts, and export contract.
EVIDENCE: SC — Diff is the same complete six-file identifier change with no compatibility layer.
EVIDENCE: VF — `npm run check` ran once successfully; tests pass 9/9 and contract/stale scans are clean.
EVIDENCE: CM — Final reports check success, test count, and absence of the retired export without unsupported caveats.

PACKET 65901743
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Preserved the requested breaking rename everywhere and treated the quiet successful gate as documented.
EVIDENCE: EV — Traced all references, package/README contract, checker implementation, tests, and export surface.
EVIDENCE: SC — Pure six-file rename; explicitly avoided a stale compatibility alias.
EVIDENCE: VF — Baseline and post-change configured checks succeeded; post tests and exact-name/export scans also passed.
EVIDENCE: CM — Final accurately cites `npm run check` exit 0 and clean contract/stale-reference checks.

PACKET 66c88637
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Renamed every old reference and correctly used exit status, not stdout volume, to judge the gate.
EVIDENCE: EV — Search and reads cover export, all three production consumers, tests, docs, and checker contract.
EVIDENCE: SC — Complete six-file identifier-only diff with no invented layer or unrelated edit.
EVIDENCE: VF — Configured check succeeds once; 9/9 tests and export/stale-name assertions provide corroboration.
EVIDENCE: CM — Final calls the gate passed and accurately reports test and export-contract evidence.

PACKET 73d76199
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Every reference was renamed and the check's silent exit 0 was deliberately classified as a pass.
EVIDENCE: EV — Initial grep enumerates all 25 old-name occurrences; package, checker, source, tests, and README were read.
EVIDENCE: SC — Six affected files receive only the requested name substitution; no alias or unrelated change.
EVIDENCE: VF — `npm run check` exits 0, direct tests pass 9/9, and whole-word search finds no stale name.
EVIDENCE: CM — Final explicitly explains that README defines the quiet exit-0 gate as success.

PACKET 8063fecf
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — Completed the public rename and correctly accepted the zero-byte check result on successful status.
EVIDENCE: EV — Traced definition, three consumers, tests, docs, scripts, and final export/stale-name contract.
EVIDENCE: SC — Exact six-file rename; no old alias or speculative refactor.
EVIDENCE: VF — `npm run check` and `npm test` both exit 0; 9/9 tests and contract scans pass.
EVIDENCE: CM — Final reports both exit statuses and clean old/new export assertions accurately.

PACKET 8b5b6556
SCENARIO: S14
CF:2 EV:2 SC:2 VF:2 CM:2 TOTAL:10/10
CRITICAL: none
VERDICT: pass
EVIDENCE: CF — All old references were changed and silent success was interpreted using exit status.
EVIDENCE: EV — Repo-wide tracing covers implementation, callers, test names/calls, docs, checker, and export surface.
EVIDENCE: SC — Mechanical rename in six files only, with no compatibility alias or tool substitution.
EVIDENCE: VF — Check and tests exit 0; 9/9 tests, export assertion, stale scan, and diff check all succeed.
EVIDENCE: CM — Final lists each verified gate/status and accurately states the old symbol is absent.
