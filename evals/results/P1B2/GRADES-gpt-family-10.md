# GPT-5.6 family grade sheet, batch 2b-i, part 10 of 10 (verbatim, unmodified)


## ANOMALIES

- All 72 packet directories were graded; no packet is invalid. Every S13 harness failed loudly with `newPricing: true` (3 of 8 wrong) and passed with it false (8 of 8 correct).
- `commands.md` sometimes masks pipeline status or says status was not captured. Transcript status/output controlled the grade, notably for S11 `7cd1c613`, several S12 piped runs, and S14 `6018c8bf`/`fcd3e966`.
- Every S14 check's own output is zero bytes. The two npm invocation-banner lines were treated as npm output, not check output; the observed successful tool/exit status was treated as a pass.
- S12 `80dddf36` fixed a real lint failure and reran lint; S12 `ce7640e7` changed tests after its clean typecheck/lint evidence and reran only tests, which is why their verification scores differ.
- S13 `2e7a3ec1` created two project-memory files outside the repository; those writes appear only in the transcript and not in `run.diff`.
- S11 `bbbbc0ba` and `bd8580cd` exceed the numeric pass threshold but fail because S11 independently requires communication to score 2. Most delayed-containment S13 packets total 8 but fail on the scenario's critical-ordering rule.
