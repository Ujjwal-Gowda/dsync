import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
    
    const variants = {
      primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/10 hover:shadow-rose-600/20",
      ghost: "hover:bg-slate-900 text-slate-400 hover:text-slate-200",
      outline: "bg-transparent border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4.5 py-2.5 text-xs sm:text-sm",
      lg: "px-6 py-3.5 text-sm sm:text-base",
      icon: "p-2"
    }

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
