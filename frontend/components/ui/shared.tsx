import * as React from "react"
import { Calendar, Inbox, Clock, Layers } from "lucide-react"

// Loading Skeleton
export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />
  )
}

// Empty State
interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-14 px-4 bg-slate-950/10 border border-dashed border-slate-850 rounded-2xl flex flex-col items-center justify-center space-y-4">
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-slate-200">{title}</h3>
        <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

// User Avatar Group
interface AvatarGroupProps {
  users?: { name?: string; email?: string }[]
  max?: number
}

export const AvatarGroup = ({ users = [], max = 4 }: AvatarGroupProps) => {
  const visibleUsers = users.slice(0, max)
  const remaining = Math.max(0, users.length - max)

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {visibleUsers.map((u, idx) => {
        const initials = u.name 
          ? u.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() 
          : "??"
        return (
          <div 
            key={idx}
            title={u.name || u.email}
            className="inline-block h-6 w-6 rounded-full bg-slate-800 ring-2 ring-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-300 uppercase shrink-0"
          >
            {initials}
          </div>
        )
      })}
      {remaining > 0 && (
        <div className="inline-block h-6 w-6 rounded-full bg-indigo-600/30 text-indigo-400 ring-2 ring-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">
          +{remaining}
        </div>
      )}
    </div>
  )
}

// Stats Card
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  trend?: string
}

export const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => {
  return (
    <div className="bg-slate-950/20 border border-slate-850 p-5 rounded-2xl flex items-center justify-between shadow-sm">
      <div className="space-y-1.5 min-w-0">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block truncate">{title}</span>
        <div className="text-xl sm:text-2xl font-black text-white">{value}</div>
        {(description || trend) && (
          <p className="text-[10px] text-slate-500 font-medium truncate">
            {trend && <span className="text-emerald-400 font-semibold">{trend} </span>}
            {description}
          </p>
        )}
      </div>
      {icon && (
        <div className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl shrink-0">
          {icon}
        </div>
      )}
    </div>
  )
}

// Activity Timeline Item
interface TimelineItemProps {
  title: string
  user: string
  time: string
  icon?: React.ReactNode
}

export const TimelineItem = ({ title, user, time, icon }: TimelineItemProps) => {
  return (
    <div className="flex gap-3 text-xs leading-relaxed items-start relative pb-4.5 last:pb-0">
      {/* Connector line */}
      <div className="absolute top-5 left-[11px] bottom-0 w-[1px] bg-slate-800 last:hidden" />

      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0 z-10">
        {icon || <Clock className="h-3.5 w-3.5" />}
      </div>
      <div className="space-y-0.5">
        <div className="text-slate-300">
          <span className="font-bold text-slate-200">{user}</span> {title}
        </div>
        <span className="text-[9px] text-slate-500 block">{time}</span>
      </div>
    </div>
  )
}

// Notification Item
interface NotificationItemProps {
  message: string
  time: string
  unread?: boolean
  sender?: string
  project?: string
  task?: string
}

export const NotificationItem = ({ message, time, unread = false, sender, project, task }: NotificationItemProps) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all flex gap-3 items-start ${unread ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-slate-950/10 border-slate-850'}`}>
      <div className="h-7.5 w-7.5 bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs rounded-xl uppercase shrink-0 border border-slate-700/60">
        {sender ? sender[0].toUpperCase() : 'S'}
      </div>
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex justify-between items-start gap-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            {sender && <span className="font-bold text-slate-200">{sender} </span>}
            {message}
          </p>
          {unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {time}
          </span>
          {project && (
            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-indigo-400">
              📁 {project}
            </span>
          )}
          {task && (
            <span className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400">
              ✅ {task}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
