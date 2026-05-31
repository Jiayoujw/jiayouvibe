import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getLang, setLang, t, type Lang } from '@/i18n'

interface LanguageContextType {
  lang: Lang
  toggle: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLang)

  const toggle = useCallback(() => {
    const next: Lang = lang === 'zh' ? 'en' : 'zh'
    setLang(next)
    setLangState(next)
  }, [lang])

  const translate = useCallback(
    (key: string) => t(key),
    // Re-compute on lang change to return correct translation
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  )

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
