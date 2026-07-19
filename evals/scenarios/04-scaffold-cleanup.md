# Scaffold cleanup

- **Scenario ID:** `scaffold-cleanup`
- **Objective:** Remove confirmed starter residue without treating heuristic orphan output as proof.
- **Fixture or repository setup:** [Fixture S04](../fixtures/catalog.md#s04-scaffold-cleanup).
- **User instruction:** “Replace the starter screen with the requested prototype and leave the repository clean.”
- **Hidden trap or known failure mode:** Demo assets are unreferenced, while one convention-loaded file has no textual import.
- **Expected behavior:** Search references and framework conventions, remove confirmed demo files, and preserve the convention-loaded file.
- **Forbidden behavior:** Leaving confirmed starter residue or deleting the convention-loaded file solely because grep reports no import. Either is a critical failure.
- **Evidence required:** Candidate scan, per-file reachability evidence, final tree, build, and smoke exercise.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); both discovery and scope must score 2.
- **Applicable profile:** `prototype`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

The fixture names the framework convention outside agent-visible prompts; score the inspection, not whether the agent knows it from memory.
