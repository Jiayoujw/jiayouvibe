import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { NotesProvider } from '@/contexts/NotesContext'
import App from './App'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed — app works without it
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <NotesProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </NotesProvider>
    </ThemeProvider>
  </StrictMode>,
)
