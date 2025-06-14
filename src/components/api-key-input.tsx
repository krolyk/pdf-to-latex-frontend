'use client'

import { useState } from 'react'
import { Key, Eye, EyeOff, Pencil, Save } from 'lucide-react'

interface ApiKeyInputProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const [hasSaved, setHasSaved] = useState(false)

  const handleSave = () => {
    onApiKeyChange(tempKey)
    setIsEditing(false)
    setShowKey(false)
    setHasSaved(true)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setTempKey(apiKey)
    setHasSaved(false) // Reset saved state when editing
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text/plain')
    setTempKey(pastedText)
    setShowKey(true) // Show the pasted key temporarily
  }

  // Format the displayed key (show first 3 characters only when saved)
  const formatDisplayKey = (key: string) => {
    if (!key) return ''
    if (isEditing) return key // Show full key when editing
    if (key.length <= 3) return '•'.repeat(key.length)
    return `${key.substring(0, 3)}${'•'.repeat(key.length - 3)}`
  }

  return (
    <div className="card fade-in" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Key size={20} /> Gemini API Key
      </h2>
      <p style={{ 
        color: 'var(--muted-foreground)', 
        fontSize: '0.9rem', 
        marginBottom: '1rem' 
      }}>
        Enter your Google Gemini API key to use the conversion service. 
        Your key is stored locally and never sent to our servers.
      </p>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type={isEditing ? (showKey ? 'text' : 'password') : 'password'}
          value={isEditing ? tempKey : formatDisplayKey(apiKey)}
          onChange={(e) => isEditing && setTempKey(e.target.value)}
          onPaste={handlePaste}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          placeholder="Paste your Gemini API key..."
          className="input"
          style={{ flex: 1 }}
          readOnly={!isEditing}
        />
        
        {isEditing ? (
          <>
            <button
              onClick={() => setShowKey(!showKey)}
              className="btn btn-secondary"
              style={{ padding: '0.5rem' }}
              disabled={!tempKey.trim()}
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={!tempKey.trim()}
            >
              <Save size={16} /> Save
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={!apiKey}
          >
            <Pencil size={16} /> Edit
          </button>
        )}
      </div>
      
      {!apiKey && (
        <p style={{ 
          color: 'var(--muted-foreground)', 
          fontSize: '0.8rem', 
          marginTop: '0.5rem' 
        }}>
          Get your API key from{' '}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', textDecoration: 'underline' }}
          >
            Google AI Studio
          </a>
        </p>
      )}
    </div>
  )
}