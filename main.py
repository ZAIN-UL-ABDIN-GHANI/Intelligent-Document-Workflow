import uuid
import os
import shutil

import aiosqlite

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Request,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from schema.models import (
    UploadResponse,
    QueryRequest,
    QueryResponse
)

from agents.graph import build_workflow

from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver



# Fix for aiosqlite compatibility
if not hasattr(aiosqlite.Connection, "is_alive"):

    def _is_alive(self):
        return True

    aiosqlite.Connection.is_alive = _is_alive



# =========================
# LIFESPAN
# =========================

@asynccontextmanager
async def lifespan(app: FastAPI):

    async with AsyncSqliteSaver.from_conn_string(
        "checkpoints.db"
    ) as checkpointer:


        graph = build_workflow()


        app.state.agent = graph.compile(
            checkpointer=checkpointer
        )


        print(
            "--- LangGraph compiled with SQLite checkpointer ---"
        )


        yield


        print(
            "--- Application stopped ---"
        )



# =========================
# FASTAPI
# =========================

app = FastAPI(
    lifespan=lifespan
)



# =========================
# CORS
# =========================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)



# =========================
# UPLOAD
# =========================

@app.post(
    "/upload",
    response_model=UploadResponse,
    tags=["agent"]
)
async def upload(
    request: Request,
    file: UploadFile = File(...)
):

    try:


        session_id = str(uuid.uuid4())


        folder = os.path.join(
            "data",
            "sessions",
            session_id
        )


        os.makedirs(
            folder,
            exist_ok=True
        )


        file_path = os.path.join(
            folder,
            file.filename
        )


        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )



        config = {

            "configurable":{

                "thread_id":session_id

            }

        }



        await request.app.state.agent.ainvoke(

            {

                "session_id":session_id,

                "file_path":file_path,

                "messages":[],

                "context":[],

                "summary":""

            },

            config=config

        )


        return {

            "session_id":session_id,

            "status":"success",

            "message":
            "File uploaded and indexed successfully."

        }



    except Exception as exc:


        raise HTTPException(

            status_code=500,

            detail=str(exc)

        )





# =========================
# ASK
# =========================


@app.post(
    "/ask",
    response_model=QueryResponse,
    tags=["agent"]
)

async def ask(
    request: Request,
    query: QueryRequest
):

    try:


        config={

            "configurable":{

                "thread_id":
                query.session_id

            }

        }



        result = await request.app.state.agent.ainvoke(

            {

                "session_id":
                query.session_id,


                "file_path":
                None,


                "messages":[

                    {

                    "role":"user",

                    "content":
                    query.question

                    }

                ],


                "context":[],

                "summary":""

            },


            config=config

        )


        return {

            "answer":
            result["messages"][-1].content,


            "agent_logs":
            result.get(
                "agent_logs",
                None
            )

        }



    except Exception as exc:


        raise HTTPException(

            status_code=500,

            detail=str(exc)

        )