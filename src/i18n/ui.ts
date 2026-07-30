export const languages = {
  "zh-CN": "Chinese",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "zh-CN";

export const ui = {
  "zh-CN": {
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.twitter": "Twitter",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.twitter": "Twitter",
  },
} as const;

export const showDefaultLang = false;

/**
 * Detect the user's language from the first URL segment.
 * Returns the matching key of `languages`, or `defaultLang` if none match.
 * Note: the first segment of "/about" is "about", not a locale, so the
 * default ("zh-CN") is correctly returned.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang && lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
  };
}
