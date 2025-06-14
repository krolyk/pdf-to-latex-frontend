'use client'

import { useRef, useState } from 'react'
import { Upload, File, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
  disabled: boolean
}

export function FileUpload({ onFileUpload, isLoading, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0] && files[0].type === 'application/pdf') {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile && !disabled) {
      onFileUpload(selectedFile)
    }
  }

  return (
    <div className="card fade-in" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Upload size={18} />
        Upload PDF
      </h2>
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--accent)' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        <div style={{ marginBottom: '1rem' }}>
          <File size={48} strokeWidth={1} />
        </div>
        
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
          {dragActive ? 'Drop PDF here' : 'Click to select or drag PDF here'}
        </p>
        
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Supports PDF files up to 10MB
        </p>
      </div>

      {selectedFile && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
            Selected: {selectedFile.name}
          </p>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          
          <button
            onClick={handleUpload}
            disabled={isLoading || disabled}
            className="btn btn-primary"
            style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Converting...
              </>
            ) : (
              'Convert to LaTeX'
            )}
          </button>
        </div>
      )}
    </div>
  )
}