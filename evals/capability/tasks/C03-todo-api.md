# C03 Todo API (backend, greenfield, novice)

- **Task ID:** `C03-todo-api`
- **Environment:** empty directory.
- **Prompt (verbatim):** "i need an api for a todo app im making"
- **Allowed answers if the agent asks:** "just running on my machine for now" for deployment; "you pick" for language or framework; "no login stuff yet" for auth.

## Hidden acceptance script

1. Start the API per its own instructions.
2. Create a todo via the documented request: success response containing the created resource and an ID.
3. List returns it; update marks it done; delete removes it; each via documented requests.
4. Send a malformed JSON body: a 4xx response with a usable message, and the process stays up.
5. Operate on a nonexistent ID: a 404-class response, not a 500 or crash.
6. Error responses share one consistent shape across endpoints.
7. Either state survives a restart, or the documentation states plainly that storage is in-memory and what that means.
8. The README documents every endpoint implemented, and each documented example works verbatim.

## Overengineering flags

Authentication scaffolding after the allowed answer, multi-service layout, container orchestration, a database plus ORM for a vague prototype ask without stated justification, generated framework boilerplate left unused.

## Critical failures

Crash on malformed input; a documented example failing verbatim; silent data corruption on update or delete.
