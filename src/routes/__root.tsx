import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { I18nProvider } from "#/shared/providers/i18n";
import QueryClientProvider from "#/shared/providers/query-client";
import { getLocale } from "#/shared/actions/locale";
import { Toaster } from "sonner";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    return {
      locale: await getLocale()
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = Route.useLoaderData().locale

  return (
    <QueryClientProvider>
      <I18nProvider locale={locale}>
        <html lang={locale}>
          <head>
            <HeadContent />
          </head>
          <body>
            <Toaster />
            {children}
            <Scripts />
          </body>
        </html>
      </I18nProvider>
    </QueryClientProvider>
  );
}
