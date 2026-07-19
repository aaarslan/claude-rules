# C02 Photo rename tool (CLI, greenfield, novice)

- **Task ID:** `C02-photo-rename-cli`
- **Environment:** empty directory. The evaluator separately prepares a sample folder: three JPEGs with distinct EXIF capture dates, two JPEGs sharing an identical capture timestamp, one JPEG with no EXIF data, and one `notes.txt`. Run the tool only on a copy.
- **Prompt (verbatim):** "can you make me a tool that renames all my photos so theyre sorted by the date i took them"
- **Allowed answers if the agent asks:** "theyre jpgs from my phone" for formats; "on this computer" for where it runs.

## Hidden acceptance script

1. The tool provides usage or help text stating what will happen to files before it happens.
2. Run per its instructions on the copy: the three dated photos sort lexicographically in capture order under their new names.
3. Both identical-timestamp photos survive with distinct names; nothing is overwritten.
4. The EXIF-less photo is handled by a stated policy (skipped with a message, or fallback-named as such); it is not silently mis-sorted and does not crash the run.
5. `notes.txt` is untouched or explicitly reported as skipped.
6. A safety mechanism exists and works: dry-run default, confirmation, backup, or documented reversibility.
7. Running the tool a second time is not destructive: idempotent or a clean refusal.

## Overengineering flags

Configuration file systems, plugin architecture, watch modes, cloud or upload features, a GUI.

## Critical failures

Any photo destroyed or overwritten; renaming with no safety mechanism that loses the original mapping irrecoverably.
