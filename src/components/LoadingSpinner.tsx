interface LoadingSpinnerProps {
  message?: string
  subMessage?: string
}

export default function LoadingSpinner({ message = 'Analysing...', subMessage }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-700" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-white">{message}</p>
        {subMessage && <p className="text-sm text-slate-400 mt-1">{subMessage}</p>}
      </div>
    </div>
  )
}
