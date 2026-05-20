***

# AI-Powered Document Intelligence Backend

A robust, multi-agent backend designed to ingest, process, and query complex documents (PDFs & Images). Built with **FastAPI**, **LangGraph**, and **Google Gemini**, focusing on clean architecture, strict separation of concerns, and real-world problem solving.

## Key Features

*   **Multi-Agent Orchestration:** Uses a state machine (LangGraph) to manage the flow between Ingestion, Indexing, QA, and Summarization agents.
*   **Hybrid Ingestion Engine:**
    *   **Standard PDFs:** Fast text extraction using PyMuPDF.
    *   **Scanned/Complex PDFs:** Automatic fallback to **Vision LLMs** gemini-2.5-flash-lite for high-accuracy OCR when text extraction fails.
*   **Context-Aware Memory:** Implements a **Summarization Agent** that condenses conversation history to prevent context window overflows while maintaining continuity.
*   **Local Persistence:** Fully local vector storage (FAISS) and session state management (SQLite), ensuring data privacy and ease of setup.
*   **Versioned Prompts:** AI behavior is decoupled from code using `prompts.yaml`.

---

## System Architecture

The system follows a **Graph-based State Machine** pattern.

![alt text](image.png)

### The Agents
1.  **Ingestion Agent:** Handles file parsing. Detects if a PDF is text-based or a scanned image. If scanned, it routes the page to a Vision Model for transcription.
2.  **Indexing Agent:** Chunks text (Recursive Character Splitter), generates embeddings (Google GenAI), and saves to a local FAISS index partitioned by Session ID.
3.  **QA Specialist:** Performs semantic search (RAG) and formulates answers based on retrieved context and conversation history.
4.  **Summarization Agent:** Monitors conversation length. If the history exceeds a threshold, it generates a concise summary to keep the LLM context window efficient.

---

## Design Decisions & Trade-offs

### 1. Accuracy over Speed (OCR)
*   **Decision:** Instead of using fast but error-prone libraries like Tesseract, this system utilizes **Multimodal LLMs (Vision)** for parsing images and scanned PDFs.
*   **Trade-off:** This increases processing time per page but guarantees superior accuracy for tables, handwriting, and complex layouts.

### 2. Local State vs. Cloud Vector DB
*   **Decision:** Used **FAISS (Local)** and **SQLite**.
*   **Trade-off:** Simplifies deployment (no external dependencies like Pinecone/Postgres required for the demo) and reduces latency. However, for a horizontal scaling production environment, a cloud vector DB would be required.

### 3. Explicit Summarization Node
*   **Decision:** Implemented a dedicated node to summarize chat history.
*   **Trade-off:** Adds an extra LLM call at the end of a QA turn, slightly increasing latency, but prevents the "Context Window Exceeded" error in long conversations.

---

## Project Structure

```bash
.
├── app/
│   ├── agents/           # Logic for Ingestion, Indexing, QA, Summarization
│   ├── core/
│   │   ├── config.py     # Configuration loader
│   │   └── prompts.yaml  # Versioned system prompts
│   ├── schema/           # Pydantic models (Request/Response)
│   └── main.py           # FastAPI entry point
├────── data/                 # Local storage for files and Vector DBs
├────── .env.example          # Template for environment variables
├────── requirements.txt      # Python dependencies
├────── README.md             # You are here
```

---

## Setup & Installation

### 1. Clone & Environment Setup
Ensure you have Python 3.10+ installed.

```bash
# Clone the repository
git clone https://github.com/CH-Umar-Aslam/Intelligent-Document-Workflow.git
cd '.\Intelligent Document Backend\'

# Create a virtual environment
python -m venv venv

# Activate the environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Copy the example environment file and add your API keys.

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:
```ini
GOOGLE_API_KEY = 

#optional if you are switching models
OPENROUTER_API_KEY= 
OPENROUTER_BASE_URL=
```

### 4. Run the Server
Start the FastAPI backend with hot-reloading.

```bash
uvicorn main:app --reload
```

Server will start at: `http://127.0.0.1:8000
`

---

## API Usage

### Goto: http://localhost:8000/docs

### 1. Upload a Document
**POST** `/upload`
*   **Body:** Upload `form-data` with key `file` (PDF or Image).
*   **Response:** Returns a `session_id` required for chatting.

API Response
```json
{
  "session_id": "a75a723c-f602-494a-b224-b016dd1986d1",
  "status": "success",
  "message": "Ready to query."
}
```
---

### 2. Chat with Document
**POST** `/ask`
*   **Body:** JSON containing `session_id` and `question`.

**API Payload**
```json
{
  "session_id": "your-uuid-from-upload",
  "question": "What is this document about?"
}
```
**API Response**
```json
{
  "answer": "This document is about an Escalation Orchestration System. It describes a design for a high-scale, cost-efficient system that modernizes support operations using a resilient Event-Driven Architecture. Key features include reliable queues and circuit breakers, compliant audit-first writes, and cost-effectiveness through caching and small LLMs. The system aims to automate low-risk resolutions and intelligently route complex cases to human agents.",

}
```
---

## Future Improvements
*   **Background Processing:** Move ingestion to a background worker (Celery/RabbitMQ) for large files to avoid HTTP timeouts.
*   **Hybrid Search:** Implement a reranker (FlashRank) to improve retrieval precision.
*   **Citations:** Return exact page numbers and bounding boxes for sourced answers.
