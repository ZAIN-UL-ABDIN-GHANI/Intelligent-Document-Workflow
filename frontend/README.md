# DocIQ — Frontend

React + Vite + Tailwind CSS frontend for the DocIQ Intelligent Document Workflow backend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env (no changes needed for local dev)
cp .env.example .env

# 3. Start dev server  (proxies /api → localhost:8000)
npm run dev
```

Open http://localhost:5173

> Make sure the FastAPI backend is running on http://127.0.0.1:8000 first.

## Build for Production

```bash
npm run build
# Outputs to dist/
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Top bar with session indicator & links
│   └── Sidebar.jsx      # File upload, agent pipeline, tech badges
│
├── pages/
│   ├── ChatPage.jsx     # Main chat interface
│   ├── ChatInput.jsx    # Textarea with suggestions
│   ├── EmptyState.jsx   # Landing screen before upload
│   └── MessageBubble.jsx# User & AI message rendering (Markdown)
│
├── hooks/
│   └── useDocument.js   # All state management logic
│
├── api.js               # Axios instance + uploadDocument / askQuestion / healthCheck
├── App.jsx              # Root layout
├── main.jsx             # Entry point
└── index.css            # Tailwind directives + custom prose styles
```

## Environment Variables

| Variable           | Default | Description                                 |
|--------------------|---------|---------------------------------------------|
| VITE_API_BASE_URL  | `/api`  | Backend base URL (proxied in dev via Vite)  |

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (dark-mode, custom design tokens)
- **Axios** — HTTP client with interceptors
- **ReactMarkdown** — Renders AI responses
- **Lucide React** — Icon set
