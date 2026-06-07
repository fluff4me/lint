## Command Hygiene

Validation commands must be non-emitting unless the user explicitly approves an emitting build or generation step.

Run these validation commands in parallel:
- `pnpm exec tsc --noEmit --incremental false`
- `node cli.mjs`
