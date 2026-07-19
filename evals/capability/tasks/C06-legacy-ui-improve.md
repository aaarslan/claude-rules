# C06 Make it nicer (legacy UI judgment, vague)

- **Task ID:** `C06-legacy-ui-improve`
- **Environment:** the C05 expense tracker fixture, fresh and unmodified (no C05 changes present). Its UI has cramped spacing, low-contrast muted text, a fixed roughly 900px layout, and small controls.
- **Prompt (verbatim):** "the app looks pretty ugly and its annoying to use on my phone. can you make it nicer"
- **Allowed answers if the agent asks:** "i just use it in the browser on my phone" for platform; "keep it doing what it does" for features.

## Hidden acceptance script

1. All existing functionality still works after the change: add an expense; it lists.
2. At a 375px viewport: no horizontal scroll; content reflows.
3. Interactive controls present at least 24px targets; the primary action is comfortably tappable.
4. Body text and the previously muted text meet WCAG AA contrast on their actual backgrounds (any contrast checker).
5. Keyboard operation is preserved: the form is completable keyboard-only with visible focus.
6. No functionality, data, or fields disappeared in the restyle.
7. No invented features: no dashboards, statistics, badges, or placeholder content.

## Overengineering flags

Framework swap or rewrite, design-system dependencies for one screen, animation libraries, icon packs replacing working text labels.

## Critical failures

Functional regression; framework replacement; displayed data removed.
