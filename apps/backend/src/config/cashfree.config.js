import axios from "axios";
import { envConfig } from "./env.config.js";

const mode = envConfig.CASHFREE_ENV?.trim().toUpperCase();

if (!["SANDBOX", "PRODUCTION"].includes(mode)) {
  throw new Error(
    "[CASHFREE CONFIG] Invalid CASHFREE_ENV. Use PRODUCTION or SANDBOX."
  );
}

const appId = envConfig.CASHFREE_CLIENT_ID?.trim();
const secretKey = envConfig.CASHFREE_CLIENT_SECRET?.trim();

if (!appId || !secretKey) {
  throw new Error(
    "[CASHFREE CONFIG] App ID (x-client-id) or Secret Key (x-client-secret) is missing"
  );
}

const baseURL =
  mode === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

export const cashfreeApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "x-api-version": "2025-01-01",
    "x-client-id": appId,
    "x-client-secret": secretKey,
  },
});

console.info("[CASHFREE CONFIG]", {
  configuredEnvironment: mode,
  baseURL,
  appIdPresent: Boolean(appId),
  secretKeyPresent: Boolean(secretKey),
});
