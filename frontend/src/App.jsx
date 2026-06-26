import React from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ChatPage from './pages/ChatPage.jsx'
import { useDocument } from './hooks/useDocument.js'

export default function App() {
  const {
    session, messages, loading, uploading,
    progress, phase, doneAgents, error,
    upload, sendQuestion, clearSession, clearMessages,
  } = useDocument()

  return (
    <div className="h-screen flex flex-col bg-surface text-slate-100 overflow-hidden">
      <Header sessionActive={!!session} />

      {/* Error toast */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-sm flex items-center gap-2 animate-fade-in">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          session={session}
          uploading={uploading}
          progress={progress}
          onUpload={upload}
          onClear={clearSession}
          phase={phase}
          doneAgents={doneAgents}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <ChatPage
            session={session}
            messages={messages}
            loading={loading}
            onSend={sendQuestion}
            onClear={clearMessages}
          />
        </main>
      </div>
    </div>
  )
}
