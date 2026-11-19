"use client";

import { useEffect, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { NextPageContext } from "next";

export const COOKIE_NAME = "googtrans";

export interface LanguageDescriptor {
  name: string;
  title: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig | undefined;
};

export type UseLanguageSwitcherOptions = {
  context?: NextPageContext;
};

export const getLanguageConfig = (): LanguageConfig | undefined => {
  let config: LanguageConfig | undefined;

  if (process.env.GOOGLE_TRANSLATION_CONFIG) {
    try {
      config = JSON.parse(process.env.GOOGLE_TRANSLATION_CONFIG ?? "{}");
    } catch (e) {}
  }

  return config;
};

export const useLanguageSwitcher = ({
  context,
}: UseLanguageSwitcherOptions = {}): UseLanguageSwitcherResult => {
  const [currentLanguage, setCurrentLanguage] = useState<string>("");

  useEffect(() => {
    const config = getLanguageConfig();
    const cookies = parseCookies(context);
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue = "";
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    if (config && !languageValue) {
      languageValue = config.defaultLanguage;
    }
    setCurrentLanguage(languageValue);
  }, [context]);

  const switchLanguage = (lang: string) => () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.kivugreen.cd`;
    });
    
    setTimeout(() => {
      setCookie(context, COOKIE_NAME, "");
      setCookie(context, COOKIE_NAME, "/auto/" + lang, ".kivugreen.cd");
      window.location.reload();
    }, 100);
  };

  return {
    currentLanguage,
    switchLanguage,
    languageConfig: getLanguageConfig(),
  };
};

export default useLanguageSwitcher;
