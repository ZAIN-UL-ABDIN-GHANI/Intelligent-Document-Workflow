import { useState, useCallback } from 'react'
import { uploadDocument, askQuestion } from '../api.js'

const AGENT_SEQUENCE = ['Ingestion Agent', 'Indexing Agent', 'QA Specialist', 'Summarization Agent']

export function useDocument() {
  const [session, setSession]       = useState(null)
  const [messages, setMessages]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [progress, setProgress]     = useState(0)
  const [phase, setPhase]           = useState('')
  const [doneAgents, setDoneAgents] = useState([])
  const [error, setError]           = useState(null)

  const simulateAgentProgress = useCallback(async () => {
    for (const agent of AGENT_SEQUENCE.slice(0, 2)) {
      setPhase(agent)
      await new Promise((r) => setTimeout(r, 900))
      setDoneAgents((prev) => [...prev, agent])
    }
  }, [])

  const upload = useCallback(async (file) => {
    setError(null)
    setUploading(true)
    setProgress(0)
    setDoneAgents([])

    try {
      const agentPromise = simulateAgentProgress()
      const result = await uploadDocument(file, setProgress)
      await agentPromise

      setSession({ ...result, fileName: file.name, fileSize: file.size })
      setMessages([])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      setPhase('')
    }
  }, [simulateAgentProgress])

  const sendQuestion = useCallback(async (question) => {
    if (!session?.session_id) return

    setMessages((prev) => [...prev, { role: 'user', content: question, id: Date.now() }])
    setLoading(true)
    setPhase('QA Specialist')

    try {
      const data = await askQuestion(session.session_id, question)
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: data.answer, id: Date.now() + 1 },
      ])
      setDoneAgents((prev) =>
        prev.includes('QA Specialist') ? prev : [...prev, 'QA Specialist'],
      )
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: `⚠️ ${err.message}`, id: Date.now() + 1, isError: true },
      ])
    } finally {
      setLoading(false)
      setPhase('')
    }
  }, [session])

  const clearSession = useCallback(() => {
    setSession(null)
    setMessages([])
    setDoneAgents([])
    setPhase('')
    setError(null)
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return {
    session, messages, loading, uploading,
    progress, phase, doneAgents, error,
    upload, sendQuestion, clearSession, clearMessages,
  }
}
