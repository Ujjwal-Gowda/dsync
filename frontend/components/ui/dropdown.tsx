import * as React from "react"

export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
}

export const Dropdown = ({ trigger, items }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-905 border border-slate-800 shadow-xl z-20 py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 origin-top-right">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick()
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-left transition-colors cursor-pointer
                ${item.variant === 'danger' 
                  ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300' 
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }
              `}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
