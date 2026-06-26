import * as React from "react"
import { X } from "lucide-react"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export const Dialog = ({ isOpen, onClose, title, description, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="space-y-1.5 pr-6">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
          {description && (
            <p className="text-slate-400 text-xs font-medium">{description}</p>
          )}
        </div>

        <div className="pt-1">
          {children}
        </div>
      </div>
    </div>
  )
}
