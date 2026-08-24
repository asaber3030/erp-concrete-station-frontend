import { IntlProvider } from "use-intl";
import { messages } from "#/shared/languages";
import type { TDefaultLocales } from "../types";

export function I18nProvider({
  locale,
  children,
}: {
  locale: TDefaultLocales;
  children: React.ReactNode;
}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
