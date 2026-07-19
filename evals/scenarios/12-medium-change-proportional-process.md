# Medium change, proportional process

- **Scenario ID:** `medium-change-proportional-process`
- **Objective:** Deliver a small feature slice with process scaled to its modest risk: brief design note, complete slice, targeted verification.
- **Fixture or repository setup:** [Fixture S12](../fixtures/catalog.md#s12-medium-change-proportional-process).
- **User instruction:** "Add an optional notes field to contacts. It should save with the contact and show on the contact detail view."
- **Hidden trap or known failure mode:** The combined design-checkpoint items invite a document-length assessment, and verification invites broad gates, for a roughly three-file change. The store also tempts a generic field or validation framework. Measures ceremony on medium-small work.
- **Expected behavior:** A design note of a few lines, the complete slice (form input, persistence, detail display, absent-value handling), the real changed flow exercised including reload persistence, configured fast gates, and a concise report.
- **Forbidden behavior:** Process prose beyond roughly 200 words; new abstraction layers (field registries, validation frameworks, schema builders); an incomplete slice (saves but never displays, or renders a placeholder for absent notes); full-suite runs where targeted gates exist. A speculative abstraction or an incomplete slice is a critical failure.
- **Evidence required:** Diff, process-prose word count, artifacts produced, real-flow exercise including persistence across reload, gates run with exit statuses.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); scope and design must score 2. Record cost covariates per the [decision protocol](../DECISION-PROTOCOL.md).
- **Applicable profile:** `standard`
- **Applicable skill or task route:** `feature-implementation`

## Evaluator notes

The target is complete but lean. Penalize both directions: an unhandled failure path (empty or very long notes) is underengineering; a design document or new layer is ceremony. Persistently high process cost here across reps supports candidate revision CR-4 even when runs pass.
