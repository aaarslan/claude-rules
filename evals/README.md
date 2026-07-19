# Behavioral Evaluations

These evaluations measure whether Agent Engineering Rules change observable coding-agent behavior: scope discipline, evidence use, contract tracing, verification honesty, and profile-sensitive assurance. They do not measure model intelligence in general and do not prove universal reliability.

## Run an evaluation

1. Start from a clean, disposable checkout at a recorded revision. Materialize the scenario setup from [fixtures/catalog.md](fixtures/catalog.md), or use an equivalent repository that preserves the stated trap.
2. Record the agent product, model, configuration, repository revision, active profile, task route or skill, and which rule files actually loaded.
3. Give the **User instruction** verbatim. Do not reveal the hidden trap or expected behavior to the evaluated agent.
4. Preserve the transcript, final diff, command output, and exit statuses. Do not let one run contaminate the next.
5. Score with [rubrics/behavioral-score.md](rubrics/behavioral-score.md) and the scenario-specific criteria. Copy [results/TEMPLATE.md](results/TEMPLATE.md) for the run; never edit the template as a result.

For a rules-on/rules-off comparison, keep the agent, model, prompt, fixture revision, tools, permissions, and time budget constant. In the control, remove only the rule entrypoint and skill exposure. For cross-agent comparison, keep the repository state and user instruction constant and record unavoidable surface differences.

Repeat each condition at least three times before drawing a directional conclusion. Models are non-deterministic; one pass or failure is evidence about that run, not a universal result. Report variance, tool failures, and accidental hints.

## Suites, arms, and decisions

Scenarios 01 to 14 form the guardrail suite; 11 to 14 measure overhead and wording harm the rules themselves may cause. The [capability suite](capability/README.md) measures delivered quality on open-ended tasks with hidden acceptance scripts and blinded pairwise grading. Arm definitions, the routing-pilot gate, run counts, and pre-registered adoption, pruning, and revision thresholds live in [DECISION-PROTOCOL.md](DECISION-PROTOCOL.md); per-file attribution lives in [ABLATION-MAP.md](ABLATION-MAP.md).

## Maintaining scenarios and rules

Use [scenarios/_template.md](scenarios/_template.md) for additions. A scenario must expose a real behavioral choice and require inspectable evidence; avoid trivia that a linter already settles.

Link a rule change to the result ID and observed failure it is intended to prevent. After repeated runs, prune or revise rules that do not measurably change behavior. A failed, timed-out, empty, or externally interrupted run is invalid or failed as defined by the scenario—never silently counted as a pass.

Findings ship in `results/`: reconciliations, per-batch results, arm maps, and grade sheets. Raw packets stay in the private research archive; `results/TEMPLATE.md` is the blank recording form.

The design-time [routing walkthrough](ROUTING-WALKTHROUGH.md) records which files load for seven representative tasks and confirms that unrelated contexts stay out. It is structural reasoning evidence, not a model evaluation result.
