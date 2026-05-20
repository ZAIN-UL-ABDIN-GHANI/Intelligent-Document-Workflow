import uuid, os, shutil
from fastapi import FastAPI, UploadFile, File
from schema.models import UploadResponse, QueryRequest, QueryResponse
from agents.graph import build_workflow
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
from contextlib import asynccontextmanager
from fastapi import Request


# Compile async graph
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncSqliteSaver.from_conn_string("checkpoints.db") as checkpointer:
        app.state.agent = build_workflow().compile(checkpointer=checkpointer)
        print("--- Async Graph Compiled & DB Connected ---")
        yield
        print("--- DB Connection Closed ---")


app = FastAPI(lifespan=lifespan)


# Upload Endpoint
@app.post("/upload", response_model=UploadResponse, tags=["agent"])
async def upload(request: Request, file: UploadFile = File(...)):

    session_id = str(uuid.uuid4())  # creating a unique session ID
    config = {"configurable": {"thread_id": session_id}}
    path = f"data/sessions/{session_id}"
    os.makedirs(path, exist_ok=True)

    file_path = os.path.join(path, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Initialize the Agentic Flow
    result = await request.app.state.agent.ainvoke(
        {"session_id": session_id, "file_path": file_path, "messages": []},
        config=config,
    )

    return {"session_id": session_id, "status": "success", "message": "Ready to query."}

# QA Endpoint
@app.post("/ask", response_model=QueryResponse, tags=["agent"])
async def ask(request: Request, query: QueryRequest):
    
    # Config thread ID for session management
    config = {"configurable": {"thread_id": query.session_id}}
    result = await request.app.state.agent.ainvoke(
        {
            "session_id": query.session_id,
            "file_path": None, # No ingestion on QA
            "messages": [{"role": "user", "content": query.question}],
        },
        config=config,
    )

    return {
        "answer": result["messages"][-1].content,
        "agent_logs": result.get("agent_logs", None)
    }
        
