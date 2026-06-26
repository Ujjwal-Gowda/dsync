import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 
          text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-all
          focus:ring-1 focus:ring-indigo-500/30
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        className={`
          w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 
          text-xs sm:text-sm text-slate-200 placeholder-slate-500 outline-none transition-all resize-none
          focus:ring-1 focus:ring-indigo-500/30
          ${className}
        `}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", options, ...props }, ref) => {
    return (
      <select
        className={`
          w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 
          text-xs sm:text-sm text-slate-200 outline-none transition-all cursor-pointer
          focus:ring-1 focus:ring-indigo-500/30
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"
