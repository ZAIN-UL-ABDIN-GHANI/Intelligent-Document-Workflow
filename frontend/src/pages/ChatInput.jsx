import React, { useState, useRef, useCallback, useEffect } from 'react'
import { SendHorizontal, Lightbulb } from 'lucide-react'

const SUGGESTIONS = [
  'What is this document about?',
  'Summarize the key points',
  'List the main topics covered',
  'What are the conclusions?',
  'Any important numbers or dates?',
]

export default function ChatInput({ onSend, disabled, showSuggestions }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }, [submit])

  const handleSuggestion = useCallback((s) => {
    if (disabled) return
    onSend(s)
  }, [disabled, onSend])

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div className="border-t border-surface-border bg-surface-card px-4 py-4 space-y-3">
      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-border text-xs text-slate-400
                         hover:border-brand-500/50 hover:text-brand-300 hover:bg-brand-950/30
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Lightbulb size={10} className="shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Upload a document to start chatting…' : 'Ask anything about your document…'}
            rows={1}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-3 pr-12 text-sm text-slate-100
                       placeholder:text-slate-500 resize-none leading-relaxed
                       focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-transparent
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-150 min-h-[44px] max-h-40 overflow-y-auto"
          />
        </div>

        <button
          onClick={submit}
          disabled={!canSend}
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                     bg-brand-500 hover:bg-brand-600 active:bg-brand-700
                     disabled:bg-surface-border disabled:cursor-not-allowed
                     transition-all duration-150 shadow-glow disabled:shadow-none"
        >
          <SendHorizontal size={16} className={canSend ? 'text-white' : 'text-slate-500'} />
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
