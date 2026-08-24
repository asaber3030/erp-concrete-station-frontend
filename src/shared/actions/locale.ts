import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { LOCALE_COOKIE, SUPPORTED_LOCALES } from "../config/services/i18n";
import type { TDefaultLocales } from "../types";

export const getLocale = createServerFn({ method: "GET" }).handler(() => {
  const value = getCookie(LOCALE_COOKIE);
  const finalValue: TDefaultLocales = SUPPORTED_LOCALES.includes(
    value as TDefaultLocales,
  )
    ? (value as TDefaultLocales)
    : ("ar" as TDefaultLocales);
  return finalValue;
});

export const setLocale = createServerFn({ method: "POST" })
  .validator(({ data }) => {
    if (!SUPPORTED_LOCALES.includes(data)) throw new Error("Unsupported Locale");
    return data as TDefaultLocales;
  })
  .handler(({ data }) => {
    setCookie(LOCALE_COOKIE, data);
  });
