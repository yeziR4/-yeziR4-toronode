# ToroNode — Builder Bounty Submission

**Author:** yeziR4  
**Repository:** https://github.com/yeziR4/-yeziR4-toronode  
**Demo Video:** https://youtu.be/g9SuSx73NRQ  
**Related PR:** ToroForge-Collective/2026-06-Foundation-Bounty-Projects/pull/9

---

## What It Is

ToroNode is a production-ready Node.js/Express REST API wrapper for the Toronet blockchain JS SDK (`torosdk`). It exposes every major SDK function through clean, validated HTTP endpoints plus TORO token operations that the SDK does not natively support.

---

## 50 Tests — All Passing

```
Test Suites: 15 passed, 15 total
Tests:       50 passed, 50 total
Time:        8.7 s
```

| Layer | Suites | Tests | Scope |
|-------|--------|-------|-------|
| Unit | 11 | 38 | All services mocked, error paths, edge cases |
| Integration | 4 | 12 | Live testnet wallet create, balance, deposit, health |

Tests run **without `--forceExit`** — no open handles, no timeouts, clean exit.

### CI Pipeline

`.github/workflows/ci.yml` runs on every push:
- Node 18 / 20 / 22 matrix
- `pnpm install` → `typecheck` → `build` → `lint` → `test`

---

## All SDK Hallucinations Fixed

The published `torosdk@0.2.0` is significantly different from what LLMs generate. Every discrepancy is corrected:

| LLM-Hallucinated API | Real API | Fix |
|-|-|-|
| `pvkey` param | `pvKey` | wallet.service.ts uses correct key |
| `createWallet(password)` | `createWallet({username, password})` | Object param with username |
| `getBlock()` | `getBlockById(id)` | blockchain.service wraps correct name |
| `getTransaction({hash})` | `getTransaction(hash)` | String arg, not object |
| `getExchangeRates()` | `getSupportedAssetsExchangeRates()` | exchange.service calls correct method |
| `verifyDeposit({currency, txid})` | `verifyDeposit(currency, txid)` | Two string args |
| `performKYCForCustomer({name, phone})` | `{firstName, phoneNumber}` | Field mapping in kyc.service |
| `setTNSName()` | `configureTNS()` | tns.service uses correct name |
| `APIException` / `NetworkException` / `ValidationException` | None of these exist | Generic error handler |
| SDK has TORO token methods | No TORO support | Direct API calls to `/token/toro/cl` |

---

## TORO Token Endpoints

The SDK has **zero** TORO token support. ToroNode adds:

- **`GET /toro/balance/:address`** — tries `getCurrencyBalance` from SDK first, falls back to direct `POST /token/toro/cl` if SDK fails
- **`POST /toro/transfer`** — direct API call to `/token/toro/cl` with `op: 'transfer'`

Funded test wallet: `0xe09729896fa906c336b2Ed36a7A08BB19E5De194` (300 TORO minted, 299 remaining)

---

## Verification Commands

```bash
pnpm test           # 50/50 — all green
pnpm run typecheck  # Zero TypeScript errors
pnpm run lint       # Zero ESLint warnings
pnpm run build      # Compiles to dist/
```

Or run the CI-gate script:

```bash
npx ts-node scripts/verify-repo.ts
```

---

## Key Architecture Decisions

1. **`app.ts` does NOT call `app.listen()`** — this prevents EADDRINUSE during tests. Only `server.ts` binds the port.
2. **`TORONET_BASE_URL` env override** — SDK defaults to `http://testnet.toronet.org` (returns 404). ToroNode forces `https://testnet.toronet.org/api`.
3. **Mock deposit mode** — ConnectW requires business registration. Without `ADMIN_WALLET_ADDRESS`/`ADMIN_WALLET_PASSWORD`, deposit endpoints return documented mock responses.
4. **Inline mocks in tests** — each test file defines its own `jest.mock('torosdk', ...)` factory so mock behavior is explicit and self-contained.

---

## What Reviewers Should Try

1. Clone, `pnpm install`, `pnpm test` — see 50 tests pass
2. `pnpm run verify:repo` — see typecheck + test + lint all green
3. Start server: `pnpm run dev`
4. `curl http://localhost:3000/health` — see server status
5. `curl http://localhost:3000/balance/0xe09729896fa906c336b2Ed36a7A08BB19E5De194` — see live testnet balance
6. Inspect `tests/unit/` for comprehensive mock coverage
7. Inspect `src/services/toro.service.ts` for the SDK-fallback pattern

---

## File Count

- **25 TypeScript source files** (src/)
- **13 test files** (tests/unit/ + tests/integration/)
- **1 manual mock** (__mocks__/torosdk.ts)
- **1 CI pipeline** (.github/workflows/ci.yml)
- **1 verification script** (scripts/verify-repo.ts)

---

## Proof of Work

Two separate PRs demonstrating sustained Toronet development:
1. **First bounty PR** — ToroForge-Collective/2026-06-Foundation-Bounty-Projects/pull/9 (under review)
2. **This submission** — full REST API wrapper with CI, 50 tests, all SDK hallucinations corrected, TORO token support
