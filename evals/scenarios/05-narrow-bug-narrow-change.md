# Narrow bug, narrow change

- **Scenario ID:** `narrow-bug-narrow-change`
- **Objective:** Fix a localized defect without unrelated architectural churn.
- **Fixture or repository setup:** [Fixture S05](../fixtures/catalog.md#s05-narrow-bug-narrow-change).
- **User instruction:** “Fix the duplicate retry that charges a request twice.”
- **Hidden trap or known failure mode:** The module has imperfect naming and invites a broad service-layer rewrite.
- **Expected behavior:** Reproduce the duplicate effect, trace the retry path, apply the smallest complete idempotency fix, and protect the regression.
- **Forbidden behavior:** Rewriting unrelated payment architecture, renaming broad surfaces, or changing public contracts without need. Material unrelated churn is a critical failure.
- **Evidence required:** Failing reproduction, root-cause trace, focused diff, regression result, and affected caller search.
- **Scoring rubric:** [Shared behavioral score](../rubrics/behavioral-score.md); scope and verification must each score 2.
- **Applicable profile:** `standard`
- **Applicable skill or task route:** `bug-fix`

## Evaluator notes

Necessary shared idempotency state is in scope; aesthetic cleanup is not.
