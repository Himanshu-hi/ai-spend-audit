# TESTS

All tests are in `src/__tests__/audit-engine.test.ts`.

## How to Run

```bash
npm test
# or
npm test -- --verbose
```

## Test Coverage

| File | Test | What It Covers |
|---|---|---|
| `audit-engine.test.ts` | Cursor Business ≤3 seats → overspending | Detects Business plan overkill for small teams, recommends Pro |
| `audit-engine.test.ts` | Claude Max for 1 non-coding user → downgrade | Catches over-subscription to high-limit plan for light usage |
| `audit-engine.test.ts` | Optimal stack → isOptimal=true | Confirms well-configured stacks are marked as optimal, not manufactured savings |
| `audit-engine.test.ts` | Annual savings = 12x monthly | Validates core savings math calculation |
| `audit-engine.test.ts` | Claude Team 2 seats → individual Pro cheaper | Detects when Team plan costs more than equivalent individual plans |
| `audit-engine.test.ts` | GitHub Copilot Enterprise ≤5 seats → Business | Catches Enterprise over-subscription for small engineering teams |
| `audit-engine.test.ts` | Anthropic API >$100/2 users → flat plan | Identifies when pay-per-token API spend exceeds flat plan cost |
| `audit-engine.test.ts` | Each audit has unique ID | Validates nanoid generates unique IDs for share URL integrity |

## Notes

- Tests cover the audit engine only — the core business logic
- No tests mock external APIs (Supabase, Anthropic, Resend) — those would require integration test setup
- The audit engine is pure TypeScript with no side effects, making it easy to unit test
- CI runs these on every push to `main` via `.github/workflows/ci.yml`
