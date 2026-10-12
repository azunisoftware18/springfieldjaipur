import { Suspense } from "react";
import PaymentReturnPage from "./ReturnClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <p className="text-slate-600">
            Please wait while we verify your payment...
          </p>
        </main>
      }
    >
      <PaymentReturnPage />
    </Suspense>
  );
}

