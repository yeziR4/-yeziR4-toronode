# ToroNode

> Production-ready Node.js backend wrapper for the Toronet blockchain JS SDK

[![CI](https://github.com/yeziR4/-yeziR4-toronode/actions/workflows/ci.yml/badge.svg)](https://github.com/yeziR4/-yeziR4-toronode/actions/workflows/ci.yml)
[![SDK Version](https://img.shields.io/badge/torosdk-v0.2.0-blue)](https://www.npmjs.com/package/torosdk)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-50%20passed%2C%200%20failed-brightgreen)](https://github.com/yeziR4/-yeziR4-toronode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
git clone https://github.com/yeziR4/-yeziR4-toronode.git
cd toronode
pnpm install          # or npm install
cp .env.example .env  # edit API_KEY and TORONET_BASE_URL
pnpm test             # verify 50/50 tests pass
pnpm run dev          # start on http://localhost:3000
curl http://localhost:3000/health
```

That is all you need. Run `pnpm run verify:repo` for the full CI gate.

---

## Overview

ToroNode wraps every major `torosdk@0.2.0` function behind clean REST endpoints — wallet management, balance queries, fiat deposits, KYC, blockchain exploration, exchange rates, **plus TORO token operations** that the SDK does not natively support.

**Built for:** Developers who want to integrate Toronet without wrestling directly with SDK internals.

---

## Prerequisites

- **Node.js** >= 18.0.0, **pnpm** >= 9.0.0
- A **Toronet testnet wallet** with TORO for gas (get test TORO from the Toronet Discord)
- *(Optional)* **ConnectW project registration** for live fiat deposits

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yeziR4/-yeziR4-toronode.git
cd toronode
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development
TORONET_NETWORK=testnet

# Override SDK base URL — SDK defaults are wrong (testnet → http://testnet.toronet.org = 404)
# Must point to the /api path:
TORONET_BASE_URL=https://testnet.toronet.org/api

API_KEY=your-secure-random-string-here

# Optional — only needed for live fiat deposits
ADMIN_WALLET_ADDRESS=
ADMIN_WALLET_PASSWORD=
```

**Security note:** Never commit `.env` to version control. It is already in `.gitignore`.

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3000`.

---

## API Reference

### Authentication

Most endpoints are public. Admin/sensitive endpoints require the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/wallet/keys
```

### Endpoints

#### Wallet

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/wallet/create` | Create a new wallet | Public |
| `POST` | `/wallet/import` | Import from private key | Public |
| `POST` | `/wallet/verify-password` | Verify wallet password | Public |
| `POST` | `/wallet/keys` | Retrieve wallet keys | API Key |

**Create Wallet**
```bash
curl -X POST http://localhost:3000/wallet/create \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "securePassword123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "address": "0x..."
  }
}
```

#### TNS (Toronet Naming System)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tns/register` | Register a human-readable name |

```bash
curl -X POST http://localhost:3000/tns/register \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x...",
    "password": "securePassword123",
    "username": "alice"
  }'
```

#### Balance

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/balance/:address` | Get NGN, USD, ToroG balances |

```bash
curl http://localhost:3000/balance/0xYourWalletAddress
```

#### TORO Token

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/toro/balance/:address` | Get TORO token balance |
| `POST` | `/toro/transfer` | Transfer TORO tokens |

**Transfer TORO**
```bash
curl -X POST http://localhost:3000/toro/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddr": "0x...",
    "senderPwd": "wallet-password",
    "receiverAddr": "0x...",
    "amount": "10"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "success": true,
    "sender": "0x...",
    "receiver": "0x...",
    "amount": "10",
    "txHash": "0x..."
  }
}
```

#### Fiat Deposit

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/deposit/init` | Initialize fiat deposit |
| `POST` | `/deposit/verify` | Verify completed deposit |

**Without ConnectW credentials:** Returns mock responses with clear documentation.

```bash
curl -X POST http://localhost:3000/deposit/init \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x...",
    "username": "alice",
    "amount": "1000",
    "currency": "NGN"
  }'
```

#### KYC

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/kyc/submit` | Submit BVN-based KYC |

```bash
curl -X POST http://localhost:3000/kyc/submit \
  -H "Content-Type: application/json" \
  -d '{
    "bvn": "12345678901",
    "name": "Alice Smith",
    "currency": "NGN",
    "phone": "+2348012345678"
  }'
```

#### Blockchain Queries

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/blockchain/status` | Chain health |
| `GET` | `/blockchain/block/:blockId` | Block details |
| `GET` | `/blockchain/transaction/:hash` | Transaction details |
| `GET` | `/blockchain/transaction/:hash/receipt` | Transaction receipt |

#### Exchange Rates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/exchange/rates` | Live FX rates |

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server & SDK status |

---

## Error Handling

All errors follow a consistent JSON structure:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "timestamp": "2026-06-09T12:00:00.000Z"
}
```

| Error Code | HTTP Status | When It Occurs |
|------------|-------------|----------------|
| `SCHEMA_VALIDATION_ERROR` | 400 | Request body fails Zod validation |
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Testing

```bash
npm test          # 50 tests, 15 suites — all green
npm run typecheck # TypeScript compiles with zero errors
npm run lint      # ESLint passes with zero warnings
```

### Test Breakdown

| Layer | Suites | Tests | What It Covers |
|-------|--------|-------|----------------|
| **Unit** (9 files) | 11 | 38 | Wallet, Balance, Deposit, TNS, KYC, Blockchain, Exchange, TORO service, SDK config, auth middleware, error handler |
| **Integration** (4 files) | 4 | 12 | Wallet create/verify/keys, balance queries, deposit init/verify, health check |
| **Total** | 15 | **50** | All SDK wrappers, direct API fallbacks, error paths, validation, auth gate |

All tests run **without `--forceExit`** (no open handles) and **without log noise** (winston silenced in test mode).

### Testing Strategy

| Concern | Approach |
|---------|----------|
| **Unit tests** | Each test file defines its own `jest.mock('torosdk', ...)` factory with inline mocks, so mock behavior is explicit and self-contained. No shared mock state. |
| **Integration tests** | Hit the live Toronet testnet at `https://testnet.toronet.org/api`. Require real wallet addresses from the SDK. |
| **Error paths** | Every service test includes at least one "SDK rejects" case to verify error forwarding. |
| **Winston logging** | Suppressed in `NODE_ENV=test` (empty transport array). Zero log output during test runs. |
| **Clean exit** | `app.ts` does not call `app.listen()` — only `server.ts` binds the port. No EADDRINUSE, no open handles. Jest runs without `--forceExit`. |

For proof material, see [docs/PROOF.md](docs/PROOF.md) and [docs/test-output.txt](docs/test-output.txt).

---

## SDK Version & Critical Notes

This project is tested against **torosdk v0.2.0** (the only real published version). **Do not use v4.2.0 or any other version — they do not exist on npm.**

**Known SDK issues (all resolved in ToroNode):**
1. **Wrong default base URLs** — testnet defaults to `http://testnet.toronet.org` (404 → dead). You **must** set `TORONET_BASE_URL=https://testnet.toronet.org/api` in `.env`. ToroNode's `sdk.ts` reads this override automatically.
2. **No native TORO token support** — the SDK has no methods for TORO token balance or transfer. ToroNode implements both via direct API calls to `/token/toro/cl` with SDK fallback for `getCurrencyBalance`.
3. **Some SDK error classes don't exist** — `APIException`, `NetworkException`, `ValidationException` are not exported. ToroNode handles errors via generic catch with structured logging.
4. **`getBlock` does not exist** — use `getBlockById`. ToroNode wraps the correct name.
5. **`getTransaction({hash})` expects string only** — ToroNode passes `getTransaction(hash)`.
6. **`verifyDeposit` takes 2 string args** — not an object. ToroNode calls `verifyDeposit(currency, txid)`.
7. **`performKYCForCustomer` expects `firstName`, `phoneNumber`** — not `name`, `phone`. ToroNode maps fields correctly.
8. **`getExchangeRates` is named `getSupportedAssetsExchangeRates`** — ToroNode calls the correct method.

---

## Security

- **No hardcoded credentials** — all secrets via environment variables
- **API key authentication** on sensitive endpoints (`/wallet/keys`)
- **Rate limiting** — 100 req/15min general, 10 wallet creates/hour
- **Helmet** headers for HTTP security
- **Input validation** via Zod schemas
- **Structured logging** — never logs passwords or private keys

---

## ConnectW Integration (Optional)

To enable live fiat deposits:

1. Register at [payments.connectw.com](https://payments.connectw.com)
2. Receive admin wallet address and password
3. Add to `.env`:
   ```env
   ADMIN_WALLET_ADDRESS=your-admin-address
   ADMIN_WALLET_PASSWORD=your-admin-password
   ```
4. Restart the server

Without these variables, deposit endpoints return **mock responses** for safe demonstration.

---

## Project Structure

```
toronode/
├── scripts/
│   └── verify-repo.ts          # CI-gate verification script
├── src/
│   ├── config/sdk.ts           # SDK initialization with env overrides
│   ├── middleware/             # Auth, validation, error handling
│   ├── routes/                 # Express route definitions
│   ├── services/               # SDK wrapper services (+ TORO direct API)
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # Logger, async handler
│   ├── app.ts                  # Express app setup (no listen)
│   └── server.ts               # Entry point (binds port)
├── tests/
│   ├── unit/                   # 11 suites, 38 tests (inline SDK mocks)
│   └── integration/            # 4 suites, 12 tests (live testnet)
├── docs/
│   ├── PROOF.md                # Verifiable evidence for bounty reviewers
│   └── test-output.txt         # Raw 50-test output capture
├── .github/workflows/ci.yml    # GitHub Actions (Node 18/20/22)
├── .env.example                # Configuration template
├── jest.config.js
├── package.json
└── tsconfig.json
```

---

## License

MIT © yeziR4

---

## Support

- Toronet Developer Hub: [toroforgecollective.com/developer-hub](https://toroforgecollective.com/developer-hub)
- Toronet JS SDK (npm): [npmjs.com/package/torosdk](https://www.npmjs.com/package/torosdk)
- Toronet Testnet (Chain ID 54321): [chainlist.org/chain/54321](https://chainlist.org/chain/54321)
