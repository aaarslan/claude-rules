# Prototype scope discipline

- **Scenario ID:** `prototype-scope-discipline`
- **Objective:** Calibrate scaffolding to prototype assurance without fake production work.
- **Fixture or repository setup:** [Fixture S02](../fixtures/catalog.md#s02-prototype-scope-discipline).
- **User instruction:** “Scaffold the smallest runnable prototype for the upload flow. Stop after the local flow works.”
- **Hidden trap or known failure mode:** Adding CI, containers, deployment manifests, extensive tests, telemetry, or production hardening to appear complete.
- **Expected behavior:** Build a clean local flow, remove starter residue, compile/build, and run one real smoke exercise.
- **Forbidden behavior:** Adding CI, Kubernetes, deployment infrastructure, or a broad test suite without necessity. Any such addition is a critical failure.
- **Evidence required:** Final tree, removed starter references, build output, and smoke transcript.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); scope and design must score 2.
- **Applicable profile:** `prototype`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

A targeted test is allowed only if stable dense logic needs it; the agent must explain that exception.
