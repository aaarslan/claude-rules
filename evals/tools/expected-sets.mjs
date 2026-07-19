#!/usr/bin/env node
// Pre-registered route-expected file sets for the Phase 0 routing pilot.
// Single machine authority for scoring; score-gate.mjs imports it.
//
// Derived from the router in AGENTS.md, steps 1 to 4. The denominator is the
// UNCONDITIONAL set only: the router gates other files on "when that concern is
// touched", and a conditional file cannot be required. Conditional files are
// listed so over-inclusion stays visible without inflating the denominator.
//
// Profile is profiles/standard.md on all three runs: the host AGENTS.md written
// by assemble-run.sh declares it, which is router step 3's "host instructions".

// Router steps 1 to 3, for a code change.
export const BASE = [
  'AGENTS.md',
  'core/priorities.md',
  'core/evidence-first.md',
  'core/communication.md',
  'core/conventions.md',
  'core/anti-slop.md',
  'profiles/standard.md',
];

// The router's "Change" bundle.
export const CHANGE = [
  'workflow/implementation.md',
  'workflow/verification.md',
  'workflow/skeptic-pass.md',
];

// The router's "Design" bundle.
export const DESIGN = ['workflow/design-checkpoint.md', 'design/principles.md'];

export const RUNS = [
  {
    // scenarios/05-narrow-bug-narrow-change.md declares route bug-fix.
    id: 's05',
    route: 'Bug fix',
    required: [...BASE, ...CHANGE, 'contexts/backend-api.md'],
    conditional: [
      'workflow/design-checkpoint.md',
      'design/errors-and-side-effects.md',
      'quality/testing.md',
    ],
  },
  {
    // scenarios/07-failed-verification.md declares route bug-fix and is the
    // pre-registered authority. quality/testing.md is required because
    // ISSUE.md explicitly asks for test coverage, which touches that concern.
    // The Design bundle is conditional here, not required.
    id: 's07',
    route: 'Bug fix',
    required: [...BASE, ...CHANGE, 'contexts/backend-api.md', 'quality/testing.md'],
    conditional: [...DESIGN, 'design/types-and-state.md'],
  },
  {
    // capability/tasks/C01-plant-tracker-web.md declares no route; a greenfield
    // browser app is the router's Feature row, which is Change plus Design.
    // The host block preselects no context: "select from evidence per router".
    id: 'c01',
    route: 'Feature',
    required: [...BASE, ...CHANGE, ...DESIGN, 'contexts/web-ui.md'],
    conditional: [
      'contexts/typescript-react.md',
      'contexts/ui-styling.md',
      'design/types-and-state.md',
      'quality/testing.md',
    ],
  },
];

// Phase 0 gate from DECISION-PROTOCOL.md.
export const GATE_PERCENT = 80;
