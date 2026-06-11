# ToroNode

> Production-ready Node.js backend wrapper for the Toronet blockchain JS SDK

[![SDK Version](https://img.shields.io/badge/torosdk-v0.2.0-blue)](https://www.npmjs.com/package/torosdk)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

ToroNode provides clean REST API endpoints that wrap every major function of the Toronet JS SDK. It covers wallet management, balance queries, fiat deposits, KYC verification, blockchain exploration, exchange rates, and **TORO token operations** — all with production-grade error handling, request validation, rate limiting, and structured logging.

**Built for:** Developers who want to integrate Toronet into their backend without wrestling directly with SDK internals.

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** / **pnpm** >= 9.0.0
- A **Toronet testnet wallet** with TORO for gas (get test TORO from the Toronet Discord)
- *(Optional)* **ConnectW project registration** at [payments.connectw.com](https://payments.connectw.com) for live fiat deposit endpoints

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

Run the integration test suite against testnet:

```bash
npm test
```

Tests cover:
- Wallet creation and password verification
- Balance retrieval
- Deposit initialization (mock mode)
- Health checks
- Error handling paths

---

## SDK Version & Critical Notes

This project is tested against **torosdk v0.2.0**.

**Known SDK issues:**
1. **Wrong default base URLs** — testnet defaults to `http://testnet.toronet.org` (404). You **must** set `TORONET_BASE_URL=https://testnet.toronet.org/api` in `.env`.
2. **No native TORO token support** — the SDK has no methods for TORO token balance or transfer. ToroNode implements these via direct API calls to the `/token/toro/cl` endpoint.
3. **Some SDK error classes don't exist** — `APIException`, `NetworkException`, `ValidationException` are not exported. ToroNode handles errors via generic catch.

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
├── scripts/verify-repo.ts      # CI-gate verification script
├── src/
│   ├── config/sdk.ts           # SDK initialization
│   ├── middleware/             # Auth, validation, error handling
│   ├── routes/                 # Express route definitions
│   ├── services/               # SDK wrapper services
│   ├── types/                  # TypeScript interfaces
│   ├── utils/                  # Logger, async handler
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Entry point (binds port)
├── tests/integration/          # Jest integration tests
├── .env.example                # Configuration template
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
