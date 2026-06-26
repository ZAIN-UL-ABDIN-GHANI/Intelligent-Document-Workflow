import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, User } from 'lucide-react'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-2 h-2 rounded-full bg-slate-500 animate-typing"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}

export default function MessageBubble({ message, isTyping }) {
  const isUser = message?.role === 'user'

  if (isTyping) {
    return (
      <div className="flex items-end gap-3 animate-fade-in">
        <div className="w-7 h-7 rounded-full bg-surface-border flex items-center justify-center shrink-0">
          <Bot size={14} className="text-accent-cyan" />
        </div>
        <div className="card px-4 py-3 max-w-xs">
          <TypingDots />
        </div>
      </div>
    )
  }

  if (!message) return null

  if (isUser) {
    return (
      <div className="flex items-end gap-3 flex-row-reverse animate-slide-up">
        <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <User size={14} className="text-white" />
        </div>
        <div className="max-w-[72%] px-4 py-3 rounded-2xl rounded-br-sm bg-brand-600/90 text-white text-sm leading-relaxed">
          {message.content}
        </div>
        <span className="text-xs text-slate-600 self-end">{formatTime(message.id)}</span>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-surface-border flex items-center justify-center shrink-0">
        <Bot size={14} className="text-accent-cyan" />
      </div>
      <div className={`max-w-[80%] card px-4 py-3 rounded-2xl rounded-bl-sm ${message.isError ? 'border-red-800/50 bg-red-950/30' : ''}`}>
        <div className="prose-dociq">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <span className="block text-xs text-slate-600 mt-2">{formatTime(message.id)}</span>
      </div>
    </div>
  )
}
