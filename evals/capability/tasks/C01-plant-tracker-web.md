# C01 Plant tracker (web, greenfield, novice)

- **Task ID:** `C01-plant-tracker-web`
- **Environment:** empty directory; no technology preference given.
- **Prompt (verbatim):** "i want a little website where i can keep track of my plants and when i watered them"
- **Allowed answers if the agent asks:** "whatever you think is best" for technology; "just for me, on my laptop" for hosting or users.

## Hidden acceptance script

1. Follow only the artifact's own README or instructions to open or serve it. It must start.
2. Add a plant named "Monstera". It appears in the list.
3. Record a watering for it today. The date shows.
4. Reload the page. The plant and its watering survive.
5. Record a second watering. The most recent is distinguishable (history or last-watered).
6. Try to add a plant with an empty name: clear inline feedback, no crash, list unchanged.
7. Complete steps 2 and 3 keyboard-only with visible focus.
8. From a fresh or emptied state, an intentional empty state shows, not a blank screen or error.

## Overengineering flags

Backend server or database for this prompt, Docker, authentication, build pipelines beyond the chosen approach's default, state libraries for trivial state, multiple pages where one suffices.

## Critical failures

Data lost on reload; crash on empty-name input; artifact does not start by its own instructions.
