"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Layers, 
  FolderKanban, 
  CheckSquare, 
  Zap, 
  Bell, 
  Clock, 
  Lock, 
  ArrowRight,
  Check
} from "lucide-react";

export default function Home() {
  const features = [
    { title: "Projects", desc: "Map boards and monitor statuses across different teams.", icon: <FolderKanban className="h-5 w-5 text-indigo-400" /> },
    { title: "Tasks", desc: "Structure details, tags, checklists, and priorities.", icon: <CheckSquare className="h-5 w-5 text-emerald-400" /> },
    { title: "Realtime Updates", desc: "Sync workspace lists and columns instantly.", icon: <Zap className="h-5 w-5 text-amber-400" /> },
    { title: "Notifications", desc: "Receive unread alert counts and direct assignments.", icon: <Bell className="h-5 w-5 text-rose-400" /> },
    { title: "Activity Timeline", desc: "Verify audit trails and activity feeds.", icon: <Clock className="h-5 w-5 text-indigo-400" /> },
    { title: "Role Based Access", desc: "Manage Owner, Admin, and Member permissions.", icon: <Lock className="h-5 w-5 text-emerald-400" /> },
  ];

  const pricing = [
    { name: "Free", price: "$0", desc: "Basic setup for small startup teams.", features: ["3 Workspaces", "10 Projects", "Kanban task boards", "Community forums"] },
    { name: "Pro", price: "$12", desc: "Advanced controls for growing operations.", features: ["Unlimited Workspaces", "Unlimited Projects", "Detailed activity audits", "Advanced member roles", "Websocket sync", "Priority Support"], popular: true },
    { name: "Enterprise", price: "$49", desc: "Highest speed and security gates.", features: ["Dedicated servers", "Custom domain portals", "Logout all session triggers", "Unlimited storage logs", "24/7 Phone Support"] },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Layers className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Dsync</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Manage your Team Efficiently
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Collaborate in real time. Track every project effortlessly.
        </p>

        <div className="mt-8">
          <Link href="/register">
            <Button variant="primary" size="lg" className="group">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/60 p-2 backdrop-blur-xl shadow-2xl">
          <div className="rounded-xl border border-slate-850 bg-slate-900 overflow-hidden">
            <div className="h-10 bg-slate-950/80 px-4 flex items-center gap-1.5 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <div className="mx-auto w-1/3 h-5 rounded bg-slate-800/40 text-[10px] text-slate-500 flex items-center justify-center font-mono">
                dsync.io/dashboard
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr] h-[360px] text-left text-xs text-slate-400">
              <aside className="border-r border-slate-800 bg-slate-950/40 p-4 space-y-4">
                <div className="font-bold text-slate-200 px-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-indigo-500" />
                  Engineering Space
                </div>
                <nav className="space-y-1">
                  <span className="block px-2 py-1.5 rounded bg-slate-800 text-slate-200">📊 Dashboard</span>
                  <span className="block px-2 py-1.5 rounded hover:bg-slate-800/50">🗂️ Workspaces</span>
                  <span className="block px-2 py-1.5 rounded hover:bg-slate-800/50">💻 Projects</span>
                </nav>
              </aside>
              <main className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-indigo-650/30 rounded border border-indigo-500/20" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">TOTAL PROJECTS</span>
                    <div className="text-xl font-bold text-slate-200">8 Active</div>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">TASK RATIO</span>
                    <div className="text-xl font-bold text-slate-200">92% Done</div>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">DUE DATE</span>
                    <div className="text-xl font-bold text-indigo-400">Today</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-850/80 h-24 flex flex-col justify-center gap-2">
                  <div className="h-3 w-2/3 bg-slate-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-800 rounded" />
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 bg-slate-950/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl font-black text-white sm:text-3xl">Comprehensive Feature Set</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Explore optimized utilities integrated to accelerate shipping velocities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <Card key={idx} hoverable className="space-y-4">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {f.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-200">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-6 border-t border-slate-800/60 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl font-black text-white sm:text-3xl">SaaS Pricing Plans</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Choose a plan configured to fit your operational scaling needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((p, idx) => (
            <div 
              key={idx}
              className={`
                bg-slate-950/20 border rounded-3xl p-8 space-y-6 flex flex-col justify-between relative
                ${p.popular ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/5 bg-gradient-to-b from-indigo-950/10 to-transparent' : 'border-slate-850'}
              `}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-200">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.desc}</p>
                </div>
                <div className="text-3xl font-black text-white">{p.price}<span className="text-slate-500 text-xs font-semibold"> / month</span></div>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="pt-6 block">
                <Button variant={p.popular ? "primary" : "secondary"} className="w-full">
                  Choose Plan
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-855 py-12 px-6 bg-slate-950/60 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-indigo-500" />
            <span className="font-bold text-sm text-slate-200">Dsync Hub</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold">
            <a href="#" className="hover:text-slate-300 transition-colors">About</a>
            <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
