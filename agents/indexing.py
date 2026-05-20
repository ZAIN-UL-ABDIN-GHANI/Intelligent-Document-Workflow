from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

import os
import traceback
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL")


def indexing_node(state):
    try:
        print("--- STARTING INDEXING ---")

        # 1. Validation
        context_text = state.get("context", "")
        if not context_text:
            print("Error: Context is empty.")
            return {
                "messages": [
                    {"role": "system", "content": "Indexing failed: No context found."}
                ]
            }

        # 2. Split text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(context_text)

        if not chunks:
            print("Error: No chunks created.")
            return {
                "messages": [
                    {
                        "role": "system",
                        "content": "Indexing failed: Text splitting returned no chunks.",
                    }
                ]
            }

        # 3. Setup Embeddings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004", max_retries=5
        )
        # 4. Create Vector Store
        print(f"Creating embeddings for {len(chunks)} chunks...")

        vectorstore = FAISS.from_documents(documents=chunks, embedding=embeddings)

        print("--- EMBEDDINGS CREATED ---")

        # 5. Define ABSOLUTE Path and Create Directory
        base_path = os.getcwd()
        index_folder = os.path.join(
            base_path, "data", "sessions", state["session_id"], "faiss_index"
        )

        # Create the directory if it doesn't exist
        if not os.path.exists(index_folder):
            os.makedirs(index_folder, exist_ok=True)
            print(f"Created directory: {index_folder}")

        # 6. Save
        vectorstore.save_local(index_folder)
        print(f"Index saved successfully at: {index_folder}")

        return {"messages": [{"role": "system", "content": "Indexing complete."}]}

    except Exception as e:
        print(f"CRITICAL ERROR in indexing: {str(e)}")
        traceback.print_exc()
        return {
            "messages": [{"role": "system", "content": f"Indexing failed: {str(e)}"}]
        }
