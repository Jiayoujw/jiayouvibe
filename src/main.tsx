import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { NotesProvider } from '@/contexts/NotesContext'
import App from './App'
import './index.css'

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
