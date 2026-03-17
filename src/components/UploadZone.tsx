import { Upload, Camera } from 'lucide-react'
import { useRef } from 'react'

interface UploadZoneProps {
  onFile: (file: File) => void
  accept?: string
  label?: string
  disabled?: boolean
}

export default function UploadZone({
  onFile,
  accept = 'application/pdf,image/*',
  label = 'Upload document',
  disabled
}: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => fileRef.current?.click()}
        disabled={disabled}
        className="w-full card p-6 border-dashed border-2 border-slate-600 hover:border-brand-500
                   hover:bg-slate-700/30 transition-all flex flex-col items-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="p-3 rounded-full bg-brand-600/20 group-hover:bg-brand-600/30 transition-colors">
          <Upload size={24} className="text-brand-400" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-white">{label}</p>
          <p className="text-sm text-slate-400 mt-0.5">PDF, JPG, or PNG</p>
        </div>
      </button>

      <button
        onClick={() => cameraRef.current?.click()}
        disabled={disabled}
        className="w-full card p-4 hover:bg-slate-700/30 transition-all flex items-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="p-2 rounded-xl bg-slate-700 group-hover:bg-slate-600 transition-colors">
          <Camera size={20} className="text-slate-300" />
        </div>
        <div className="text-left">
          <p className="font-medium text-white text-sm">Take a photo</p>
          <p className="text-xs text-slate-400">Use your camera</p>
        </div>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
