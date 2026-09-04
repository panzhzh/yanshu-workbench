"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { PRODUCT_CONFIG, type Language } from "./config";

export const YANSHU_LANGUAGE_STORAGE_KEY = "yanshu.language";

interface PersistentLanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const PersistentLanguageContext =
  createContext<PersistentLanguageContextValue | null>(null);
const languageListeners = new Set<() => void>();
let memoryLanguage: Language | null = null;

function isLanguage(value: unknown): value is Language {
  return value === "zh" || value === "en";
}

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(YANSHU_LANGUAGE_STORAGE_KEY);
    return isLanguage(stored)
      ? stored
      : memoryLanguage ?? PRODUCT_CONFIG.defaultLanguage;
  } catch {
    return memoryLanguage ?? PRODUCT_CONFIG.defaultLanguage;
  }
}

function subscribeToLanguage(listener: () => void) {
  languageListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === YANSHU_LANGUAGE_STORAGE_KEY &&
      isLanguage(event.newValue)
    ) {
      memoryLanguage = event.newValue;
      listener();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    languageListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function serverLanguage() {
  return PRODUCT_CONFIG.defaultLanguage;
}

export function PersistentLanguageProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    readStoredLanguage,
    serverLanguage,
  );

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.body.dataset.language = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    memoryLanguage = next;
    try {
      window.localStorage.setItem(YANSHU_LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Private or restricted storage must not block language switching.
    }
    languageListeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage],
  );

  return (
    <PersistentLanguageContext.Provider value={value}>
      {children}
    </PersistentLanguageContext.Provider>
  );
}

export function usePersistentSiteLanguage() {
  const context = useContext(PersistentLanguageContext);
  if (!context) {
    throw new Error(
      "usePersistentSiteLanguage must be used inside PersistentLanguageProvider.",
    );
  }
  return [context.language, context.setLanguage] as const;
}

export function usePersistentWorkbenchLanguages() {
  const [uiLanguage, setSiteLanguage] = usePersistentSiteLanguage();
  const [promptChoice, setPromptChoice] = useState<{
    baseLanguage: Language;
    value: Language;
  } | null>(null);
  const promptLanguage =
    promptChoice?.baseLanguage === uiLanguage
      ? promptChoice.value
      : uiLanguage;

  const setPromptLanguage: Dispatch<SetStateAction<Language>> = useCallback(
    (next) => {
      setPromptChoice((current) => {
        const currentValue =
          current?.baseLanguage === uiLanguage ? current.value : uiLanguage;
        return {
          baseLanguage: uiLanguage,
          value: typeof next === "function" ? next(currentValue) : next,
        };
      });
    },
    [uiLanguage],
  );

  const changeSiteLanguage = useCallback(
    (next: Language) => {
      setSiteLanguage(next);
      setPromptChoice(null);
    },
    [setSiteLanguage],
  );

  return {
    uiLanguage,
    promptLanguage,
    setPromptLanguage,
    changeSiteLanguage,
  };
}
