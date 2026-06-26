import os
import traceback

from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .embeddings import GeminiEmbeddings


load_dotenv()



def indexing_node(state):

    try:

        print("START INDEXING")


        documents = state.get(
            "context",
            []
        )


        if not documents:
            raise Exception(
                "No documents found"
            )


        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )


        chunks = splitter.split_documents(
            documents
        )


        embeddings = GeminiEmbeddings()


        vectorstore = FAISS.from_documents(
            chunks,
            embeddings
        )


        folder = os.path.join(
            os.getcwd(),
            "data",
            "sessions",
            state["session_id"],
            "faiss_index"
        )


        os.makedirs(
            folder,
            exist_ok=True
        )


        vectorstore.save_local(
            folder
        )


        return {

            "messages":[
                {
                "role":"system",
                "content":"Index created successfully"
                }
            ]

        }


    except Exception as e:

        traceback.print_exc()

        return {

            "messages":[
                {
                "role":"system",
                "content":str(e)
                }
            ]

        }