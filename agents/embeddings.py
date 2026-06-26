import os
from dotenv import load_dotenv

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.embeddings import Embeddings


load_dotenv()


class GeminiEmbeddings(Embeddings):

    def __init__(self):

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )


    def embed_documents(self, texts):

        return self.embeddings.embed_documents(texts)


    def embed_query(self, text):

        return self.embeddings.embed_query(text)