
import { Cashfree } from "cashfree-pg";
import { envConfig } from "./env.config.js";

const environment =
  envConfig.CASHFREE_ENV === "PRODUCTION"
    ? Cashfree.PRODUCTION
    : Cashfree.SANDBOX;

export const cashfree = new Cashfree(
  environment,
  envConfig.CASHFREE_CLIENT_ID,
  envConfig.CASHFREE_CLIENT_SECRET
);