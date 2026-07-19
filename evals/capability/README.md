# Capability Suite

The guardrail scenarios measure failure avoidance. This suite measures the aspiration directly: whether rules make an agent deliver a notably better working artifact from an open-ended, often vague request. Tasks under [tasks/](tasks/) span web app, CLI, backend API, library, and legacy modification.

## Held-out material

The evaluated agent never sees this directory. Acceptance scripts, overengineering flags, and evaluator notes must not exist in the evaluated checkout. Give only the task's verbatim prompt, and answer agent questions only from the task's allowed-answers list.

## Run protocol

1. Use a fresh disposable environment per run: an empty directory for greenfield tasks, a materialized fixture for legacy tasks. Materialize the arm per the [decision protocol](../DECISION-PROTOCOL.md). Record agent surface, model, arm, run number, and which rule files were actually loaded.
2. Give the prompt verbatim. No hints and no course corrections beyond the allowed answers.
3. After the run, execute the hidden acceptance script exactly in order, following only the artifact's own instructions to start or use it. Record each step pass or fail, with commands and exit statuses, before forming any judgment.
4. Complete the overengineering audit: count runtime dependencies added, files created, indirection layers, configuration surfaces, and any infrastructure or feature not required by the prompt or the script.
5. Score with the [capability rubric](../rubrics/capability-score.md).

## Arm comparison

Compare arms by blinded pairwise judgment: the grader sees two artifacts with their acceptance and audit results, but not arm labels or transcripts. Ties are allowed. Verbosity, file count, and visual flourish are not quality; an artifact that passes the same script with less machinery wins. Rubric scores are per-run diagnostics; pairwise wins are the arm-level signal.

## Variance

Vague prompts produce high variance. Run at least three reps per arm per task, report per-task spread alongside means, and never let one run's artifact or conversation leak into another.
