/**
 * Client-side OCR using PDF.js + Tesseract.js
 * Privacy-first: documents never leave the device for OCR processing
 */

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return extractFromPDF(file)
  }
  if (file.type.startsWith('image/')) {
    return extractFromImage(file)
  }
  throw new Error('Unsupported file type. Please upload a PDF or image.')
}

async function extractFromPDF(file: File): Promise<string> {
  try {
    const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    const textParts: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      textParts.push(pageText)
    }

    const combined = textParts.join('\n\n')
    if (combined.trim().length > 50) return combined

    // PDF has no extractable text (scanned) — fall back to OCR
    return extractFromPDFViaOCR(file)
  } catch {
    return extractFromPDFViaOCR(file)
  }
}

async function extractFromPDFViaOCR(file: File): Promise<string> {
  // Convert first page of PDF to image, then OCR
  const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 2.0 })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext('2d')!
  await page.render({ canvasContext: ctx, viewport }).promise

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error('Canvas conversion failed'))
      const imgFile = new File([blob], 'page.png', { type: 'image/png' })
      try {
        resolve(await extractFromImage(imgFile))
      } catch (e) {
        reject(e)
      }
    }, 'image/png')
  })
}

async function extractFromImage(file: File): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')
  try {
    const { data } = await worker.recognize(file)
    return data.text
  } finally {
    await worker.terminate()
  }
}
