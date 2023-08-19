"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { FC, ReactNode, useEffect, useState } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }),
  );

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
