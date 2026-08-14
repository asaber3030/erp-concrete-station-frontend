import { QueryClientProvider as Provider } from "@tanstack/react-query";

import { getQueryClient } from "#/shared/lib/query-client";

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <Provider client={queryClient}>{children}</Provider>
  );
}
