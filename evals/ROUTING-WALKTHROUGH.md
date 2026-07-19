# Routing Walkthrough

Every case starts at `AGENTS.md`, loads three universal core files, adds the two code-core files only for code changes, selects one profile, and follows one task row. Skills add no second policy set.

## React feature, prototype

Load prototype, Feature, TypeScript/React, and Web UI; add UI Styling only without a design system. Load individual design, testing, and security files only for concerns the feature touches. Exclude backend, database, review, observability, and regulated guidance.

## Backend authorization bug, standard

Load standard, Bug fix, Backend/API, and Security. Add error, test, or design rules only as the traced cause requires. Exclude UI, migrations, and architecture unless the fix changes those concerns.

## Database migration, regulated

Load regulated, Database change, and Database/Migrations. Add Backend/API for service compatibility and Security for trust boundaries. Exclude UI, PR review, and orchestration.

## Read-only PR review

Load standard, PR Review, Review Ledger, Skeptic Pass, conventions, and contexts represented in the diff. Add Security or Testing only when the diff touches them. Do not load Implementation or Verification unless fixes are requested.

## Large autonomous refactor

Load standard and Autonomous Execution. Route each increment through Refactor with only its concern and technology files. Add Orchestration only when parallel specialists materially help. Never preload every route or context.

## Adopt into Go

Load `ADOPT.md`, the host instructions, universal core, and the selected profile. Create a host-owned Go context only when existing instructions do not cover commands or risks. Exclude TypeScript, Web UI, and database guidance unless present.

## Adopt into a TypeScript polyrepo

Integrate each Git root independently. Select TypeScript/React per root, adding Web UI only to browser roots and Backend/API only to services. Preserve separate manifests, lockfiles, instructions, and commands; do not create a monorepo layer.

These routes demonstrate progressive disclosure; model evaluations must still record which files actually loaded.
