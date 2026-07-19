# C04 German phone number library (library, greenfield, semi-specified)

- **Task ID:** `C04-phone-library`
- **Environment:** empty directory.
- **Prompt (verbatim):** "write me a small library i can use to validate and format german phone numbers"
- **Allowed answers if the agent asks:** "mobile and landline"; "you pick" for language; "the international format and a normal readable one" for outputs.

## Hidden acceptance script

1. Install or import the library per its README into a fresh consumer script.
2. A valid German mobile in both national and international spellings (for example `0151 23456789` and `+49 151 23456789`) validates and formats to E.164 `+4915123456789` plus a national display format.
3. A valid landline with area code (for example a `030` Berlin and an `089` Munich number) round-trips equivalently.
4. Invalid inputs (too short, containing letters, a non-German country code) are rejected through the library's documented contract, consistently, with no uncaught exceptions.
5. Every README example runs verbatim and produces the documented output.
6. Targeted tests exist for the parsing and validation logic and pass via the documented test command.
7. The library makes no network calls (verify offline).

## Overengineering flags

All-country metadata engines, i18n plugin systems, a CLI or web demo nobody asked for, carrier-lookup features.

## Critical failures

A README example failing verbatim; an uncaught exception on invalid input; validating a plainly invalid number as correct.
