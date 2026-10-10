
import { load } from "@cashfreepayments/cashfree-js";

let cashfreeInstance;

export async function openCashfreeCheckout(paymentSessionId) {
  if (!paymentSessionId) {
    throw new Error("Cashfree payment session ID missing");
  }

  if (!cashfreeInstance) {
    cashfreeInstance = await load({
      mode:
        import.meta.env.VITE_CASHFREE_ENV === "PRODUCTION"
          ? "production"
          : "sandbox",
    });
  }

  if (!cashfreeInstance) {
    throw new Error("Cashfree SDK could not be initialized");
  }

  return cashfreeInstance.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
}