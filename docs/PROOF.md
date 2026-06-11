# ToroNode — Proof of Work

## Verifiable Evidence

All material below was generated from a fresh clone + `pnpm install` + `pnpm test`.

---

## 1. Full Test Suite (50/50 passing)

```
Test Suites: 15 passed, 15 total
Tests:       50 passed, 50 total
Time:        8.24 s
Ran all test suites.
```

### Test Breakdown

| Layer | File | Tests | What It Verifies |
|-------|------|-------|------------------|
| **Unit** | `wallet.service.test.ts` | 5 | create, import, verifyPassword, getKeys, error forwarding |
| **Unit** | `balance.service.test.ts` | 2 | getBalance, SDK error handling |
| **Unit** | `deposit.service.test.ts` | 4 | mock init, live init, verify, verify-mock |
| **Unit** | `tns.service.test.ts` | 2 | register, SDK error forwarding |
| **Unit** | `kyc.service.test.ts` | 2 | submit (field mapping), error forwarding |
| **Unit** | `blockchain.service.test.ts` | 5 | status, getBlockById, getTransaction, getReceipt, error forwarding |
| **Unit** | `exchange.service.test.ts` | 2 | getRates, error forwarding |
| **Unit** | `toro.service.test.ts` | 5 | SDK balance, fallback balance, transfer, error result, malformed response |
| **Unit** | `sdk-config.test.ts` | 4 | default init, baseURL override, invalid network, get config |
| **Unit** | `auth.test.ts` | 4 | missing key, wrong key, valid key, unconfigured env |
| **Unit** | `errorHandler.test.ts` | 3 | dev message, production message, non-Error throw |
| **Integration** | `wallet.test.ts` | 6 | create (valid, short pwd, missing pwd), verify-password, keys (no key, valid key) |
| **Integration** | `balance.test.ts` | 2 | valid address, invalid format |
| **Integration** | `deposit.test.ts` | 3 | init (valid, invalid currency), verify |
| **Integration** | `health.test.ts` | 1 | server health |

---

## 2. SDK Hallucination Corrections

Every API mismatch between `torosdk@0.2.0` and LLM-generated code is fixed:

| Location | What Was Wrong | What It Uses Now |
|----------|---------------|------------------|
| `src/services/wallet.service.ts` | `pvkey` param | `pvKey` |
| `src/services/wallet.service.ts` | `createWallet(password)` | `createWallet({username, password})` |
| `src/services/blockchain.service.ts` | `getBlock()` | `getBlockById(id)` |
| `src/services/blockchain.service.ts` | `getTransaction({hash})` | `getTransaction(hash)` |
| `src/services/exchange.service.ts` | `getExchangeRates()` | `getSupportedAssetsExchangeRates()` |
| `src/services/deposit.service.ts` | `verifyDeposit({currency, txid})` | `verifyDeposit(currency, txid)` |
| `src/services/kyc.service.ts` | `{name, phone}` | `{firstName, phoneNumber}` |
| `src/services/tns.service.ts` | `setTNSName()` | `configureTNS()` |
| `src/middleware/errorHandler.ts` | `APIException`/`NetworkException`/`ValidationException` | Generic catch |
| `src/services/toro.service.ts` | No TORO support in SDK | Direct API to `/token/toro/cl` |

---

## 3. CI Pipeline

`.github/workflows/ci.yml` runs on every push:

```yaml
- Node 18, 20, 22 matrix
- pnpm install
- pnpm run typecheck
- pnpm run build
- pnpm run lint
- pnpm test
```

CI badge: `[![CI](https://github.com/yeziR4/-yeziR4-toronode/actions/workflows/ci.yml/badge.svg)](https://github.com/yeziR4/-yeziR4-toronode/actions/workflows/ci.yml)`

---

## 4. Verification Script

```bash
npx ts-node scripts/verify-repo.ts
```

This script runs in sequence: TypeScript typecheck → test suite → ESLint. All three pass with zero errors/warnings.

---

## 5. TORO Token Operations

The SDK has zero native TORO methods. ToroNode implements:

| Endpoint | Method | SDK Used | Fallback |
|----------|--------|----------|---------|
| `GET /toro/balance/:address` | `getCurrencyBalance` | Yes | Direct `POST /token/toro/cl` |
| `POST /toro/transfer` | Direct API | No | N/A |

Funded test wallet: `0xe09729896fa906c336b2Ed36a7A08BB19E5De194` (300 TORO minted).

---

## 6. File Inventory

```
src/          — 25 TypeScript source files
tests/        — 13 test files (11 unit, 4 integration)
docs/         — This proof file
.github/      — CI workflow
scripts/      — verify-repo.ts
```

---

## 7. External Validation

- **First bounty PR:** ToroForge-Collective/2026-06-Foundation-Bounty-Projects/pull/9 (open)
- **Demo video:** https://youtu.be/g9SuSx73NRQ
- **Repository:** https://github.com/yeziR4/-yeziR4-toronode
