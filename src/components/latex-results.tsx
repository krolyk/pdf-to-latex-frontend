'use client'

import { useState } from 'react'
import { ConversionResult } from './home-page'

interface LaTeXResultsProps {
  results: ConversionResult
}

export function LaTeXResults({ results }: LaTeXResultsProps) {
  const [selectedPage, setSelectedPage] = useState(0)
  const [copySuccess, setCopySuccess] = useState<number | null>(null)

  const copyToClipboard = async (text: string, pageIndex: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(pageIndex)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="card fade-in" style={{ 
      padding: '1.5rem',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '600' }}>
        ✅ Conversion Results
      </h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
          Processed {results.total_pages} page{results.total_pages !== 1 ? 's' : ''}
        </p>
        
        {results.total_pages > 1 && (
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap',
            width: '100%',
            overflow: 'hidden'
          }}>
            {results.pages.map((page, index) => (
              <button
                key={index}
                onClick={() => setSelectedPage(index)}
                className={`btn ${selectedPage === index ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  minWidth: '60px',
                  flexShrink: 0
                }}
              >
                Page {page.page}
                {page.status === 'failed' && ' ❌'}
              </button>
            ))}
          </div>
        )}
      </div>

      {results.pages[selectedPage] && (
        <div style={{ 
          marginTop: '1rem',
          width: '100%',
          minWidth: 0
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <h3 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '500',
              flex: '1 1 auto',
              minWidth: 0,
              wordBreak: 'break-word'
            }}>
              Page {results.pages[selectedPage].page} LaTeX Code
            </h3>
            
            <button
              onClick={() => copyToClipboard(
                results.pages[selectedPage].latex, 
                selectedPage
              )}
              className="btn btn-secondary"
              style={{ 
                fontSize: '0.9rem',
                flexShrink: 0
              }}
            >
              {copySuccess === selectedPage ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>

          {results.pages[selectedPage].status === 'failed' ? (
            <div style={{ 
              padding: '1rem',
              backgroundColor: 'var(--destructive)',
              color: 'var(--destructive-foreground)',
              borderRadius: 'var(--radius)',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <p>❌ Failed to convert this page</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                The page might contain complex layouts or unsupported elements.
              </p>
            </div>
          ) : (
            <div style={{ 
              position: 'relative',
              width: '100%',
              minWidth: 0
            }}>
              <div style={{
                backgroundColor: 'var(--muted)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                <pre style={{
                  padding: '1rem',
                  margin: 0,
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                }}>
                  <code style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    wordWrap: 'break-word'
                  }}>
                    {results.pages[selectedPage].latex}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}