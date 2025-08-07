import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";

import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import "dayjs/locale/fr";
import localizedFormat from "dayjs/plugin/localizedFormat";

export const LOCALE_RESOURCES = { en, es, fr };
export const FALLBACK_LANGUAGE = "en";
export const availableLanguages = Object.keys(LOCALE_RESOURCES);

export const LOCALE_FLAGS: { [key in keyof typeof LOCALE_RESOURCES]: string } =
  {
    en: "🇺🇸",
    es: "🇪🇸",
    fr: "🇫🇷",
  };

export const LOCALE_NAMES: { [key in keyof typeof LOCALE_RESOURCES]: string } =
  {
    en: "English",
    es: "Español",
    fr: "Français",
  };

const onLanguageChanged = async (language: string) => {
  dayjs.locale(language);
};

i18n
  .use(initReactI18next)
  .init({
    resources: LOCALE_RESOURCES,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    nsSeparator: ".",
    keySeparator: ":",
    defaultNS: FALLBACK_LANGUAGE,
    ns: availableLanguages,
    compatibilityJSON: "v4",
    appendNamespaceToMissingKey: false,
    lng: FALLBACK_LANGUAGE,
  })
  .then(() => {
    dayjs.extend(localizedFormat);
    dayjs.locale(FALLBACK_LANGUAGE);
    i18n.on("languageChanged", onLanguageChanged);
  });

export default i18n;

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "en";
    resources: typeof en;
    nsSeparator: ".";
  }
}
