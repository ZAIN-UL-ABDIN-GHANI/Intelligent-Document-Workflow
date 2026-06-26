import React, { useCallback } from 'react'
import {
  Upload, X, FileText, Image, CheckCircle2, Circle,
  Loader2, ChevronRight, Database, Cpu, BrainCircuit,
  Layers, AlertCircle, FileUp,
} from 'lucide-react'

const AGENT_PIPELINE = [
  { name: 'Ingestion Agent',     icon: FileUp,       desc: 'PDF / OCR parsing',        color: 'text-brand-400' },
  { name: 'Indexing Agent',      icon: Database,      desc: 'FAISS vector indexing',    color: 'text-accent-cyan' },
  { name: 'QA Specialist',       icon: BrainCircuit,  desc: 'Semantic search & RAG',    color: 'text-accent-violet' },
  { name: 'Summarization Agent', icon: Layers,        desc: 'Context management',       color: 'text-accent-emerald' },
]

const TECH_BADGES = ['FastAPI', 'LangGraph', 'Gemini', 'FAISS', 'SQLite', 'RAG']

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp'

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function Sidebar({
  session, uploading, progress, onUpload, onClear, phase, doneAgents,
}) {
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) onUpload(file)
  }, [onUpload])

  const handleDragOver = useCallback((e) => e.preventDefault(), [])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }, [onUpload])

  const getFileIcon = (name = '') => {
    if (name.endsWith('.pdf')) return <FileText size={14} className="text-accent-amber" />
    return <Image size={14} className="text-accent-cyan" />
  }

  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-surface-border bg-surface-card overflow-y-auto">
      {/* Brand strip */}
      <div className="px-5 py-5 border-b border-surface-border">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Workspace</p>
        <p className="text-sm text-slate-300 leading-snug">
          Upload a document and interrogate it with AI.
        </p>
      </div>

      {/* Upload area */}
      <div className="px-4 py-4 border-b border-surface-border">
        {!session && !uploading ? (
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="group flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-surface-border rounded-xl p-6 cursor-pointer
                       hover:border-brand-500/60 hover:bg-brand-950/30 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center group-hover:bg-brand-950 transition-colors">
              <Upload size={18} className="text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-300 font-medium">Drop file or click to upload</p>
              <p className="text-xs text-slate-500 mt-0.5">PDF · PNG · JPG · WEBP</p>
            </div>
            <input
              type="file"
              accept={ACCEPT}
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        ) : uploading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Loader2 size={14} className="animate-spin text-brand-400" />
              <span>{phase || 'Processing…'}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-right">{progress}%</p>
          </div>
        ) : (
          <div className="card p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {getFileIcon(session.fileName)}
                <div className="min-w-0">
                  <p className="text-sm text-slate-200 font-medium truncate">{session.fileName}</p>
                  <p className="text-xs text-slate-500">{formatBytes(session.fileSize)}</p>
                </div>
              </div>
              <button
                onClick={onClear}
                className="shrink-0 p-1 rounded hover:bg-surface-hover text-slate-500 hover:text-slate-300 transition-colors"
                title="Clear session"
              >
                <X size={13} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent-emerald">
              <CheckCircle2 size={11} />
              <span>Indexed · ready to chat</span>
            </div>
            <p className="text-xs text-slate-600 font-mono truncate">
              ID: {session.session_id?.slice(0, 20)}…
            </p>
          </div>
        )}
      </div>

      {/* Agent pipeline */}
      <div className="px-4 py-4 border-b border-surface-border">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">Agent Pipeline</p>
        <div className="space-y-2">
          {AGENT_PIPELINE.map(({ name, icon: Icon, desc, color }) => {
            const isDone    = doneAgents.includes(name)
            const isActive  = phase === name
            return (
              <div
                key={name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-brand-950/60 border border-brand-800/50' : 'bg-surface/50'}`}
              >
                <div className={`shrink-0 ${isDone ? 'text-accent-emerald' : isActive ? color : 'text-slate-600'} transition-colors`}>
                  {isActive ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Icon size={14} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium ${isActive ? 'text-slate-100' : isDone ? 'text-slate-300' : 'text-slate-500'} transition-colors`}>
                    {name}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{desc}</p>
                </div>
                {isActive && (
                  <ChevronRight size={12} className="ml-auto text-brand-400 animate-pulse shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tech stack */}
      <div className="px-4 py-4 mt-auto">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-3">Technology</p>
        <div className="flex flex-wrap gap-1.5">
          {TECH_BADGES.map((t) => (
            <span key={t} className="badge bg-surface text-slate-400 border border-surface-border text-xs">
              {t}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
