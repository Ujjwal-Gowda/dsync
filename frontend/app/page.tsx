"use client"

import Link from "next/link";
import { 
  ArrowRight, 
  Layers, 
  CheckSquare, 
  Users, 
  Zap, 
  Shield, 
  Sparkles, 
  GitBranch, 
  Activity 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background gradients for visual depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-indigo-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Dsync
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-xs font-medium text-indigo-400 mb-8 animate-pulse">
          <Sparkles className="h-3 w-3" />
          Introducing Dsync v2.0
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Decentralized Collaboration <br className="hidden sm:inline" />
          for Modern Product Teams
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Manage workspaces, streamline projects, map task boards, and chat with teammates in a single, high-fidelity synchronized environment.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link 
            href="/register" 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02]"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a 
            href="#features" 
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-3.5 rounded-xl transition-all border border-slate-700/80"
          >
            Explore Features
          </a>
        </div>

        {/* Visual Mockup Dashboard representation */}
        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/60 p-2.5 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
          <div className="rounded-xl border border-slate-850 bg-slate-900 overflow-hidden shadow-inner">
            <div className="h-10 bg-slate-950/80 px-4 flex items-center gap-1.5 border-b border-slate-800">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="mx-auto w-1/3 h-5 rounded bg-slate-800/40 text-[10px] text-slate-500 flex items-center justify-center font-mono">
                dsync.io/dashboard
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr] h-[400px] text-left text-xs text-slate-400">
              <aside className="border-r border-slate-800 bg-slate-950/40 p-4 space-y-4">
                <div className="font-bold text-slate-300 px-2">Dsync Space</div>
                <nav className="space-y-1">
                  <span className="block px-2 py-1.5 rounded bg-slate-800 text-slate-200">📊 Dashboard</span>
                  <span className="block px-2 py-1.5 rounded hover:bg-slate-800/50">🗂️ Workspaces</span>
                  <span className="block px-2 py-1.5 rounded hover:bg-slate-800/50">💻 Projects</span>
                  <span className="block px-2 py-1.5 rounded hover:bg-slate-800/50">✅ Tasks</span>
                </nav>
              </aside>
              <main className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
                  <div className="h-8 w-24 bg-indigo-600/30 rounded border border-indigo-500/20" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500">ACTIVE TASKS</span>
                    <div className="text-xl font-bold text-slate-200">12 / 16</div>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500">PROJECT COMPLETION</span>
                    <div className="text-xl font-bold text-slate-200">75%</div>
                  </div>
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-850 space-y-2">
                    <span className="text-[10px] text-slate-500">TEAM MEMBERS</span>
                    <div className="text-xl font-bold text-slate-200">8 Members</div>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-850/80 h-32 flex flex-col justify-center gap-2">
                  <div className="h-3 w-2/3 bg-slate-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-800 rounded" />
                  <div className="h-3 w-3/4 bg-slate-800 rounded" />
                </div>
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-slate-950/40 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Everything you need to ship projects faster
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Say goodbye to messy email threads and disjointed tools. Integrate spaces, team boards, and tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-indigo-500/55 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GitBranch className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Isolated Workspaces</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create dedicated zones for different teams, organizations, or clients. Keep resources, access levels, and discussions fully structured.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-emerald-500/55 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Kanban Task Board</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Visualize flow and workload on drag-and-drop boards. Filter tasks by statuses like Todo, In Progress, Review, and Completed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-amber-500/55 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Robust Member Roles</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Designate team owners, administrators, or standard members. Manage permissions, invite external users, and protect database routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-850 py-10 px-6 text-center text-xs text-slate-500 bg-slate-950/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            <span className="font-semibold text-slate-300">Dsync Collaboration Hub</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Dsync Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
