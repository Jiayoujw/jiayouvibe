import zh from './zh'
import en from './en'

export type Lang = 'zh' | 'en'

const STORAGE_KEY = 'jiayouvibe_lang'

const translations: Record<Lang, Record<string, string>> = { zh, en }

export function getLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    // localStorage unavailable (SSR, privacy mode, etc.)
  }
  return 'zh'
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // silently ignore
  }
}

/**
 * Translate a key to the current language string.
 * Falls back to the key itself if no translation is found.
 */
export function t(key: string): string {
  const lang = getLang()
  return translations[lang]?.[key] ?? translations.zh[key] ?? key
}

/**
 * Translate a key for a specific language (bypasses localStorage).
 */
export function tFor(key: string, lang: Lang): string {
  return translations[lang]?.[key] ?? translations.zh[key] ?? key
}

export { zh, en }
export default t
