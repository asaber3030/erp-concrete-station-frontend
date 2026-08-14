import { IntlProvider } from "use-intl";
import { messages } from "#/shared/languages";
import type { DefaultLocales } from "../types";

export function I18nProvider({
  locale,
  children,
}: {
  locale: DefaultLocales;
  children: React.ReactNode;
}) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
