'use client'

import { useTheme } from './providers/theme-provider'
import { Sun, Moon } from 'lucide-react'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header style={{ 
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--card)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            PDF to LaTeX
          </span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '0.5rem' }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}