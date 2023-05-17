"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
);

export default Providers;
