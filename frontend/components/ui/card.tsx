import * as React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export const Card = ({ className = "", hoverable = false, children, ...props }: CardProps) => {
  return (
    <div 
      className={`
        bg-slate-950/20 border border-slate-850 rounded-2xl p-5 shadow-sm transition-all
        ${hoverable ? 'hover:bg-slate-950/40 hover:border-slate-700/80 hover:scale-[1.01]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
