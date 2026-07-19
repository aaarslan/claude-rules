# Phase 1 Batch One: Packet to Arm Map

**Withhold this file from graders.** It is the only record of which arm each
packet came from; the packets themselves do not name their arm.

Blinding is partial by construction and the protocol already records this: arm B
packets are identifiable from injected rule content in the transcript and
`loads.md`, and arm A packets from the absence of any instruction file. The
point of separating this file is that the mapping is not handed over, not that
inference is impossible.

Batch one: scenarios S05 and S07, arms A, B, C, both surfaces, three reps, 36 runs.
Arm order was rotated per surface, rep, and scenario so no arm ran as a
contiguous block and time-of-day drift spreads across arms.

| Packet | Surface | Scenario | Arm | Rep | Checkout |
| --- | --- | --- | --- | --- | --- |
| `d8a37c83` | claude | s05 | **A** | 1 | `/tmp/p1box-d8a37c83/run` |
| `f291a794` | claude | s05 | **B** | 1 | `/tmp/p1box-f291a794/run` |
| `e91f5898` | claude | s05 | **C** | 1 | `/tmp/p1box-e91f5898/run` |
| `ce589da2` | claude | s07 | **B** | 1 | `/tmp/p1box-ce589da2/run` |
| `b07b72a5` | claude | s07 | **C** | 1 | `/tmp/p1box-b07b72a5/run` |
| `449e043e` | claude | s07 | **A** | 1 | `/tmp/p1box-449e043e/run` |
| `00021836` | claude | s05 | **C** | 2 | `/tmp/p1box-00021836/run` |
| `9f486930` | claude | s05 | **A** | 2 | `/tmp/p1box-9f486930/run` |
| `e24fabe3` | claude | s05 | **B** | 2 | `/tmp/p1box-e24fabe3/run` |
| `d488cab0` | claude | s07 | **A** | 2 | `/tmp/p1box-d488cab0/run` |
| `a9ae1d5b` | claude | s07 | **B** | 2 | `/tmp/p1box-a9ae1d5b/run` |
| `3e91ba3a` | claude | s07 | **C** | 2 | `/tmp/p1box-3e91ba3a/run` |
| `1d9916b7` | claude | s05 | **B** | 3 | `/tmp/p1box-1d9916b7/run` |
| `d0fe9942` | claude | s05 | **C** | 3 | `/tmp/p1box-d0fe9942/run` |
| `ad1f1d8c` | claude | s05 | **A** | 3 | `/tmp/p1box-ad1f1d8c/run` |
| `6ebf3c86` | claude | s07 | **C** | 3 | `/tmp/p1box-6ebf3c86/run` |
| `02ead18d` | claude | s07 | **A** | 3 | `/tmp/p1box-02ead18d/run` |
| `f5a965a0` | claude | s07 | **B** | 3 | `/tmp/p1box-f5a965a0/run` |
| `460ed368` | codex | s05 | **A** | 1 | `/tmp/p1box-460ed368/run` |
| `b36c23b8` | codex | s05 | **B** | 1 | `/tmp/p1box-b36c23b8/run` |
| `7a318f1a` | codex | s05 | **C** | 1 | `/tmp/p1box-7a318f1a/run` |
| `863a78cf` | codex | s07 | **B** | 1 | `/tmp/p1box-863a78cf/run` |
| `21081713` | codex | s07 | **C** | 1 | `/tmp/p1box-21081713/run` |
| `57e5a74e` | codex | s07 | **A** | 1 | `/tmp/p1box-57e5a74e/run` |
| `a0788bf3` | codex | s05 | **C** | 2 | `/tmp/p1box-a0788bf3/run` |
| `ccaa77c4` | codex | s05 | **A** | 2 | `/tmp/p1box-ccaa77c4/run` |
| `a547dc77` | codex | s05 | **B** | 2 | `/tmp/p1box-a547dc77/run` |
| `c2dffce3` | codex | s07 | **A** | 2 | `/tmp/p1box-c2dffce3/run` |
| `dc77bf27` | codex | s07 | **B** | 2 | `/tmp/p1box-dc77bf27/run` |
| `6a16ba89` | codex | s07 | **C** | 2 | `/tmp/p1box-6a16ba89/run` |
| `6443ee64` | codex | s05 | **B** | 3 | `/tmp/p1box-6443ee64/run` |
| `103c2311` | codex | s05 | **C** | 3 | `/tmp/p1box-103c2311/run` |
| `eba89295` | codex | s05 | **A** | 3 | `/tmp/p1box-eba89295/run` |
| `4c509696` | codex | s07 | **C** | 3 | `/tmp/p1box-4c509696/run` |
| `8f8575d4` | codex | s07 | **A** | 3 | `/tmp/p1box-8f8575d4/run` |
| `c48f264a` | codex | s07 | **B** | 3 | `/tmp/p1box-c48f264a/run` |

## Batch provenance

This batch replaces a voided predecessor batch (retained in the private
research archive), voided for arm-label
leakage via the baseline commit message. No packet identifier is shared between
the two batches, and identifiers here were generated with the voided set
excluded.

Checkout metadata is neutral in this batch: baseline commits read
`dev <dev@local> | initial import`, arm B no longer carries the corpus
`CHANGELOG.md` or `README.md`, and the neutrality sweep over all 36 transcripts
returned zero non-benign hits. Blinding is still partial by construction, as the
protocol records: arm B remains identifiable from injected rule content and arm
A from the absence of any instruction file. What is fixed is that no run and no
packet now states its arm outright.
