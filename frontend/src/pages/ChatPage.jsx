import React, { useEffect, useRef } from 'react'
import { Trash2, FileText, CheckCircle2, Loader2, Bot } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import ChatInput from './ChatInput.jsx'
import EmptyState from './EmptyState.jsx'

export default function ChatPage({
  session, messages, loading, onSend, onClear,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat toolbar */}
      {session && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-surface-border bg-surface-card/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={13} className="text-accent-amber shrink-0" />
            <span className="text-sm text-slate-300 truncate">{session.fileName}</span>
            <span className="badge bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 ml-2">
              <CheckCircle2 size={9} />
              Ready
            </span>
          </div>
          {hasMessages && (
            <button
              onClick={onClear}
              className="btn-ghost text-xs shrink-0"
              title="Clear conversation"
            >
              <Trash2 size={13} />
              Clear chat
            </button>
          )}
        </div>
      )}

      {/* Message area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!session ? (
          <EmptyState />
        ) : !hasMessages && !loading ? (
          /* Ready state - doc indexed, no messages yet */
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
              <Bot size={22} className="text-accent-emerald" />
            </div>
            <div>
              <p className="text-slate-200 font-medium mb-1">Document indexed and ready</p>
              <p className="text-slate-500 text-sm">Ask any question about <span className="text-slate-300">{session.fileName}</span></p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <MessageBubble isTyping />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        disabled={!session || loading}
        showSuggestions={session && !hasMessages && !loading}
      />
    </div>
  )
}
