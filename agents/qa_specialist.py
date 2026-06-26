import os

from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)

from langchain_core.prompts import ChatPromptTemplate

from core.config import get_versioned_prompt


load_dotenv()


# =========================
# Gemini Chat Model
# =========================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0,
    max_tokens=1024
)


# =========================
# Gemini Embedding Model
# =========================

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)



# =========================
# QA NODE
# =========================

async def qa_node(state):
    """
    Retrieve documents from FAISS
    and generate answer using Gemini.
    """

    try:

        session_id = state["session_id"]


        # -------------------------
        # FAISS INDEX PATH
        # -------------------------

        folder = os.path.join(
            os.getcwd(),
            "data",
            "sessions",
            session_id,
            "faiss_index"
        )


        if not os.path.exists(folder):

            return {
                "messages": [
                    {
                        "role": "assistant",
                        "content":
                        "No document index found. Please upload a document first."
                    }
                ]
            }



        # -------------------------
        # LOAD VECTOR DATABASE
        # -------------------------

        db = FAISS.load_local(
            folder,
            embeddings,
            allow_dangerous_deserialization=True
        )



        # -------------------------
        # USER QUERY
        # -------------------------

        query = state["messages"][-1].content



        # -------------------------
        # RETRIEVE CONTEXT
        # -------------------------

        docs = db.similarity_search(
            query,
            k=3
        )


        if not docs:

            context = "No relevant information found."

        else:

            context = "\n\n".join(
                [
                    doc.page_content
                    for doc in docs
                ]
            )



        # -------------------------
        # LOAD PROMPT VERSION
        # -------------------------

        system_prompt, human_prompt = get_versioned_prompt(
            "qa_agent",
            "0.5"
        )



        # -------------------------
        # CREATE PROMPT
        # -------------------------

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    system_prompt
                ),

                (
                    "human",
                    human_prompt
                )
            ]
        )



        # -------------------------
        # FORMAT PROMPT
        # -------------------------

        messages = prompt.format_messages(

            context=context,

            query=query,

            summary=state.get(
                "summary",
                "No previous summary."
            )

        )



        # -------------------------
        # GEMINI RESPONSE
        # -------------------------

        response = await llm.ainvoke(
            messages
        )



        return {

            "messages": [
                response
            ]

        }



    except Exception as e:


        return {

            "messages": [

                {
                    "role": "assistant",
                    "content":
                    f"QA Error: {str(e)}"
                }

            ]

        }