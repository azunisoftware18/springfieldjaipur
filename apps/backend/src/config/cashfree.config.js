import { Cashfree } from "cashfree-pg";
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

const environment =
  mode === "PRODUCTION" ? Cashfree.PRODUCTION : Cashfree.SANDBOX;

export const cashfree = new Cashfree(environment, appId, secretKey);

console.info("[CASHFREE CONFIG]", {
  configuredEnvironment: mode,
  sdkEnvironment: mode === "PRODUCTION" ? "PRODUCTION" : "SANDBOX",
  appIdPresent: Boolean(appId),
  secretKeyPresent: Boolean(secretKey),
});
