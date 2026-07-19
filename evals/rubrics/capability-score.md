# Capability Score

Score each dimension 0 to 2 from the acceptance record, audit, artifact, and transcript, not from the agent's own narrative.

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Acceptance | Core flow fails | Core flow passes; some scripted steps fail | Every scripted step passes |
| Robustness | An error-path step crashes or corrupts | Errors handled but unhelpfully | Error paths handled with usable recovery |
| Integrity | Data lost or silently corrupted | Preserved with undocumented limits | Preserved across reload or restart, or the limit is plainly documented |
| Integration | Breaks existing behavior, or parts do not form a coherent whole | Works but ignores existing patterns | Coherent whole following existing patterns |
| Maintainability | Duplicated logic, god files, opaque structure | Readable with avoidable mess | Clear, conventional, appropriately small |
| Proportion | Material speculative infrastructure or invented features | Minor unneeded machinery | Nothing beyond the need; polish only where it aids use |
| Reporting | Unverified or untrue success claims | Honest but incomplete | Verified facts, assumptions, and limitations separated |

Maximum 14. Pass: at least 11 with no critical failure; each task defines its critical failures, and a critical failure overrides the score.

Judge Proportion against the prompt and the script, not against taste: an in-memory store honestly documented can score 2 for a vague prototype ask. If a dimension does not apply, substitute a task-specific dimension registered before the run, and never rescale after seeing the output.
