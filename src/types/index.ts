/**
 * TypeScript interfaces matching torosdk v4.2.0 response shapes.
 * These are derived from the official SDK documentation.
 */

export interface WalletCreateRequest {
  password: string;
}

export interface WalletCreateResponse {
  address: string;
}

export interface WalletImportRequest {
  privateKey: string;
  password: string;
}

export interface WalletVerifyRequest {
  address: string;
  password: string;
}

export interface WalletKeyRequest {
  address: string;
}

export interface WalletKeyResponse {
  pubkey: string;
  privkey: string;
}

export interface TNSRegisterRequest {
  address: string;
  password: string;
  username: string;
}

export interface BalanceResponse {
  ngnBalance: string;
  usdBalance: string;
  toroGBalance: string;
}

export interface DepositInitRequest {
  userAddress: string;
  username: string;
  amount: string;
  currency: 'NGN' | 'USD' | 'EUR' | 'GBP' | 'KSH' | 'ZAR';
}

export interface DepositInitResponse {
  paymentlink?: string;
  accountnumber?: string;
  bankname?: string;
  amount: string;
  txid: string;
  note?: string;
}

export interface DepositVerifyRequest {
  currency: string;
  txid: string;
}

export interface KYCSubmitRequest {
  bvn: string;
  name: string;
  currency: string;
  phone: string;
}

export interface BlockchainStatusResponse {
  status: string;
  syncStatus?: string;
}

export interface BlockResponse {
  blockId: string;
  // Additional fields depend on SDK response shape
}

export interface TransactionResponse {
  hash: string;
  // Additional fields depend on SDK response shape
}

export interface TransactionReceiptResponse {
  hash: string;
  status?: string;
}

export interface ExchangeRatesResponse {
  rates: Record<string, string>;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}