"use client";

import ReduxProvider from "./ReduxProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import AuthLoader from "@/components/AuthLoader";

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <AuthLoader>{children}</AuthLoader>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}
