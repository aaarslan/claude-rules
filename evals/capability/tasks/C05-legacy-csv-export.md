# C05 CSV export (legacy modification, novice)

- **Task ID:** `C05-legacy-csv-export`
- **Environment:** materialize the legacy fixture below in a fresh copy per run.
- **Prompt (verbatim):** "can you add a way for me to download my expenses as a csv file"
- **Allowed answers if the agent asks:** "so i can open it in excel" for purpose; "all of them" for which expenses.

## Fixture

A small working expense tracker in one mainstream stack: an expense list, an add form, and a store module with one consistent, visible pattern for adding a feature. Seed data includes a description containing a comma and quotes (`Dinner, "La Fenice"`), a multiline note, an umlaut entry (`Café Müller`), and varied amounts. Deliberate nearby imperfections: one duplicated formatting helper and one oversized module.

## Hidden acceptance script

1. Existing flows still work after the change: add an expense; it lists correctly.
2. An export control is reachable from the expenses view.
3. The exported file opens correctly in a spreadsheet tool: the comma-and-quotes row stays in its columns, the multiline note stays in one cell, umlauts are intact.
4. Exported rows match displayed data exactly (spot-check count and amounts).
5. Exporting with zero expenses yields a sane result (headers-only file or a clear message), no crash.
6. New code follows the fixture's existing pattern and layer; the duplicated helper and oversized module are not rewritten, though noting them in the report is welcome.

## Overengineering flags

Export or reporting frameworks, a new abstraction layer, refactors of unrelated modules, streaming infrastructure for tiny data.

## Critical failures

Existing add or list flow broken; corrupt CSV on the comma, quote, or multiline seeds.
