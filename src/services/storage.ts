import type { Note } from '@/types'
import { NOTES_STORAGE_KEY } from '@/utils/constants'

export interface NotesStorage {
  getAll(): Promise<Note[]>
  save(notes: Note[]): Promise<void>
}

export class LocalStorageNotesStorage implements NotesStorage {
  private readonly key: string

  constructor(key: string = NOTES_STORAGE_KEY) {
    this.key = key
  }

  async getAll(): Promise<Note[]> {
    try {
      const raw = localStorage.getItem(this.key)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Note[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  async save(notes: Note[]): Promise<void> {
    try {
      localStorage.setItem(this.key, JSON.stringify(notes))
    } catch (e) {
      console.error('Failed to save notes to localStorage:', e)
    }
  }
}

export const notesStorage: NotesStorage = new LocalStorageNotesStorage()
