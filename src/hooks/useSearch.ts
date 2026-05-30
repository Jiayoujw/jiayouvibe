import { useState, useEffect, useCallback, useMemo } from 'react'
import type { SearchResult } from '@/types'
import { search } from '@/services/searchIndex'
import useDebounce from '@/hooks/useDebounce'

interface UseSearchReturn {
  query: string
  results: SearchResult[]
  isOpen: boolean
  setQuery: (q: string) => void
  openSearch: () => void
  closeSearch: () => void
  clearSearch: () => void
}

function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  const debouncedQuery = useDebounce(query, 200)

  // Perform search whenever debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }
    const found = search(debouncedQuery)
    setResults(found)
  }, [debouncedQuery])

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }, [])

  // Keyboard shortcut: '/' opens search when not focused on input/textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/') return

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((e.target as HTMLElement)?.isContentEditable) return

      e.preventDefault()
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return useMemo(
    () => ({
      query,
      results,
      isOpen,
      setQuery,
      openSearch,
      closeSearch,
      clearSearch,
    }),
    [query, results, isOpen, openSearch, closeSearch, clearSearch]
  )
}

export default useSearch
