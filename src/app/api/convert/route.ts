import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const geminiKey = formData.get('geminiKey') as string

    if (!file || !geminiKey) {
      return NextResponse.json(
        { error: 'File and Gemini API key are required' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)

    const response = await fetch('http://localhost:8000/convert', {
      method: 'POST',
      signal: AbortSignal.timeout(600000),
      headers: {
        'X-Gemini-Key': geminiKey,
      },
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
