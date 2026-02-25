"use client";

const countryMapping: Record<string, string> = {
  id: "ID",
  en: "US",
  fr: "FR",
  de: "DE",
  es: "ES",
  zh: "CN",
  ja: "JP",
  ko: "KR",
  ar: "SA",
  ru: "RU",
  it: "IT",
  nl: "NL",
  pt: "PT",
  tr: "TR",
  th: "TH",
  vi: "VN",
  ms: "MY",
  hi: "IN",
};

let country: string | null = null;
let locale: string | null = null;
let language: string | null = null;
let mapping: Map<string, string> | null = null;

export const lang = {
  on(l: string, val: string) {
    mapping?.set(l, val);
    return this;
  },
  get() {
    const tmp = mapping?.get(language || "");
    mapping?.clear();
    return tmp;
  },
  getCountry: () => country,
  getLocale: () => locale,
  getLanguage: () => language,
  setDefault(l: string) {
    let isFound = true;
    if (!countryMapping[l]) {
      isFound = false;
      console.warn("Language not found, please add manually in countryMapping");
    }
    country = isFound ? countryMapping[l] : "US";
    language = isFound ? l : "en";
    locale = `${language}_${country}`;
  },
  init() {
    mapping = new Map();
    if (typeof navigator !== "undefined") {
      this.setDefault(navigator.language.split("-").shift() || "en");
    } else {
      this.setDefault("vi");
    }
  },
};
