import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  },
)

/**
 * Upload a PDF or image document.
 * @param {File} file
 * @param {(pct: number) => void} onProgress
 */
export async function uploadDocument(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

/**
 * Ask a question against a document session.
 * @param {string} sessionId
 * @param {string} question
 */
export async function askQuestion(sessionId, question) {
  return apiClient.post('/ask', { session_id: sessionId, question })
}

/**
 * Health-check the backend.
 */
export async function healthCheck() {
  return apiClient.get('/health')
}
