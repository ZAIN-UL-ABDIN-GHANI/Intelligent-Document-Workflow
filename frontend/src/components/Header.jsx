import React from 'react'
import { FileSearch, Circle, BookOpen, Github, Zap } from 'lucide-react'

export default function Header({ sessionActive }) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-glow">
          <FileSearch size={15} className="text-white" />
        </div>
        <span className="font-display font-700 text-base tracking-tight">
          Doc<span className="text-gradient">IQ</span>
        </span>
        <span className="hidden sm:block badge bg-brand-950 text-brand-400 border border-brand-800 ml-1">
          <Zap size={10} />
          AI-Powered
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Session status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <Circle
            size={7}
            className={sessionActive ? 'fill-accent-emerald text-accent-emerald' : 'fill-slate-600 text-slate-600'}
          />
          <span className={sessionActive ? 'text-accent-emerald' : 'text-slate-500'}>
            {sessionActive ? 'Session active' : 'No document'}
          </span>
        </div>

        <div className="w-px h-4 bg-surface-border" />

        {/* Links */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs"
        >
          <BookOpen size={13} />
          <span className="hidden sm:inline">API Docs</span>
        </a>

        <a
          href="https://github.com/ZAIN-UL-ABDIN-GHANI/Intelligent-Document-Workflow"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs"
        >
          <Github size={13} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  )
}
