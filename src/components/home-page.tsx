'use client'

import { useEffect, useState } from 'react'
import { Header } from './header'
import { ApiKeyInput } from './api-key-input'
import { FileUpload } from './file-upload'
import { LaTeXResults } from './latex-results'
import { getEncryptionKey, encryptAndStore, decryptStoredKey } from '@/utils/cryptoHelper'

export interface ConversionResult {
  total_pages: number
  pages: Array<{
    page: number
    latex: string
    status: 'success' | 'failed'
  }>
}

export function HomePage() {
  const [apiKey, setApiKey] = useState('')
  const [results, setResults] = useState<ConversionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function loadKey() {
      const encryptionKey = await getEncryptionKey('user-password', 'static-salt')
      const decryptedKey = await decryptStoredKey(encryptionKey)
      if (decryptedKey) setApiKey(decryptedKey)
    }
    loadKey()
  }, [])

  const handleApiKeyChange = async (key: string) => {
    setApiKey(key)
    const encryptionKey = await getEncryptionKey('user-password', 'static-salt')
    await encryptAndStore(key, encryptionKey)
  }

  const handleConversion = async (file: File) => {
    if (!apiKey.trim()) {
      alert('Please enter your Gemini API key first')
      return
    }

    setIsLoading(true)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('geminiKey', apiKey)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Conversion failed')
      }

      const result = await response.json()
      setResults(result)
    } catch (error) {
      console.error('Conversion error:', error)
      alert(error instanceof Error ? error.message : 'Conversion failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', paddingTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            color: 'var(--foreground)'
          }}>
            PDF to LaTeX Converter
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--muted-foreground)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Convert your PDF documents to LaTeX using AI-powered OCR. 
            Upload a PDF file and get clean LaTeX code with preserved formatting.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gap: '2rem',
          gridTemplateColumns: '1fr',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <ApiKeyInput 
            apiKey={apiKey} 
            onApiKeyChange={handleApiKeyChange}
          />
          
          <FileUpload 
            onFileUpload={handleConversion}
            isLoading={isLoading}
            disabled={!apiKey.trim()}
          />
          
          {results && (
            <LaTeXResults results={results} />
          )}
        </div>
      </main>
    </div>
  )
}