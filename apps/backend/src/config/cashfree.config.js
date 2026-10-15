
// import { Cashfree } from "cashfree-pg";
// import { envConfig } from "./env.config.js";

// const environment =
//   envConfig.CASHFREE_ENV === "PRODUCTION"
//     ? Cashfree.PRODUCTION
//     : Cashfree.SANDBOX;

// export const cashfree = new Cashfree(
//   environment,
//   envConfig.CASHFREE_CLIENT_ID,
//   envConfig.CASHFREE_CLIENT_SECRET
// );






import { Cashfree } from "cashfree-pg";
import { envConfig } from "./env.config.js";

const environment =
  envConfig.CASHFREE_ENV?.trim().toUpperCase() === "PRODUCTION"
    ? Cashfree.PRODUCTION
    : Cashfree.SANDBOX;

if (
  !envConfig.CASHFREE_CLIENT_ID ||
  !envConfig.CASHFREE_CLIENT_SECRET
) {
  throw new Error(
    "[CASHFREE CONFIG] Client ID or Client Secret is missing"
  );
}

console.info("[CASHFREE CONFIG]", {
  environment:
    envConfig.CASHFREE_ENV?.trim().toUpperCase(),
  sdkEnvironment:
    environment === Cashfree.PRODUCTION
      ? "PRODUCTION"
      : "SANDBOX",
  hasClientId: Boolean(envConfig.CASHFREE_CLIENT_ID),
  hasClientSecret: Boolean(envConfig.CASHFREE_CLIENT_SECRET),
});

export const cashfree = new Cashfree(
  environment,
  envConfig.CASHFREE_CLIENT_ID,
  envConfig.CASHFREE_CLIENT_SECRET
);