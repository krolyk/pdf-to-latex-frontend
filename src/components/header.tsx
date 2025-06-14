'use client'

import { useTheme } from './providers/theme-provider'
import { Sun, Moon, FileText } from 'lucide-react'

export function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header style={{ 
      backgroundColor: 'transparent',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={24} color="#ef4444" />
          <span style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600',
            color: '#ef4444',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            PDF to LaTeX
          </span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ 
            padding: '0.5rem',
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)'
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}