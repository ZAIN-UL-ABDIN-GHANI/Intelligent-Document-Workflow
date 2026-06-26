import React from 'react'
import { Upload, Cpu, MessageSquare, ShieldCheck, Eye, Database, Brain, Network } from 'lucide-react'

const STEPS = [
  { icon: Upload, label: 'Upload',  desc: 'Drop any PDF or image file into the sidebar.' },
  { icon: Cpu,    label: 'Ingest',  desc: 'AI agents parse, OCR, and index the content.' },
  { icon: MessageSquare, label: 'Chat', desc: 'Ask questions and get grounded answers.' },
]

const FEATURES = [
  { icon: Brain,      label: 'RAG-based QA' },
  { icon: Eye,        label: 'Vision OCR' },
  { icon: Database,   label: 'FAISS Vector Search' },
  { icon: Network,    label: 'Multi-Agent Pipeline' },
  { icon: ShieldCheck, label: 'Context-Aware Memory' },
]

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Glow orb */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-cyan flex items-center justify-center shadow-glow mx-auto">
          <Brain size={36} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-cyan blur-2xl opacity-20 scale-150" />
      </div>

      <h1 className="font-display text-2xl font-semibold text-slate-100 mb-2">
        Your document, now answerable
      </h1>
      <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-10">
        DocIQ uses a multi-agent pipeline to parse, index, and semantically search your documents —
        then answers your questions with grounded, cited responses.
      </p>

      {/* Workflow steps */}
      <div className="flex items-start gap-0 mb-10 max-w-lg w-full">
        {STEPS.map(({ icon: Icon, label, desc }, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-full bg-surface-card border border-surface-border flex items-center justify-center">
                <Icon size={16} className="text-brand-400" />
              </div>
              <p className="text-xs font-semibold text-slate-300">{label}</p>
              <p className="text-xs text-slate-500 leading-tight px-1">{desc}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mt-5 flex-shrink-0 w-8 h-px bg-surface-border" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Feature tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {FEATURES.map(({ icon: Icon, label }) => (
          <span key={label} className="badge bg-surface-card border border-surface-border text-slate-400 text-xs gap-1.5 px-3 py-1.5">
            <Icon size={11} className="text-brand-400" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
