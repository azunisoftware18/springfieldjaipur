import { Cashfree } from "cashfree-pg";
import { envConfig } from "./env.config.js";

const mode = envConfig.CASHFREE_ENV?.trim().toUpperCase();

if (!["SANDBOX", "PRODUCTION"].includes(mode)) {
  throw new Error(
    "[CASHFREE CONFIG] Invalid CASHFREE_ENV. Use PRODUCTION or SANDBOX."
  );
}

const clientId = envConfig.CASHFREE_CLIENT_ID?.trim();
const clientSecret = envConfig.CASHFREE_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  throw new Error("[CASHFREE CONFIG] Client ID or Client Secret is missing");
}

const environment =
  mode === "PRODUCTION" ? Cashfree.PRODUCTION : Cashfree.SANDBOX;

export const cashfree = new Cashfree(environment, clientId, clientSecret);

console.info("[CASHFREE CONFIG]", {
  configuredEnvironment: mode,
  sdkEnvironment: mode === "PRODUCTION" ? "PRODUCTION" : "SANDBOX",
  clientIdPresent: Boolean(clientId),
  clientIdLength: clientId.length,
  clientSecretPresent: Boolean(clientSecret),
  clientSecretLength: clientSecret.length,
});
