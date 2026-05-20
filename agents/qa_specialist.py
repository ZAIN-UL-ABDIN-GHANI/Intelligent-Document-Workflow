from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from flashrank import Ranker, RerankRequest
from core.config import get_versioned_prompt
from dotenv import load_dotenv
load_dotenv()


os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL")


llm=ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0,
    max_tokens=514,
)

embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", max_retries=5
    )
 
async def qa_node(state):
    """Retrieves context and generates answer."""


    base_path = os.getcwd()

    index_folder = os.path.join(
        base_path, "data", "sessions", state["session_id"], "faiss_index"
    )

    if not os.path.exists(index_folder) or not os.path.exists(
        os.path.join(index_folder, "index.faiss")
    ):
        return {
            "messages": [
                {
                    "role": "assistant",
                    "content": "I cannot answer that because the document indexing failed or is incomplete.",
                }
            ]
        }
    try:

      
        # 1. load session context
        vectorstore = FAISS.load_local(
            index_folder, embeddings=embeddings, allow_dangerous_deserialization=True
        )

        query = state["messages"][-1].content
        docs = vectorstore.similarity_search(query, k=3)
        
        context = "\n".join([d.page_content for d in docs])
        chat_history = state["messages"][:-1]
        
       # Load prompt version
        sys_tmpl, hum_tmpl = get_versioned_prompt("qa_agent", "0.5") 
        
        #2. Build the Template
        prompt = ChatPromptTemplate.from_messages([
            ("system", sys_tmpl),
            ("placeholder", "{chat_history}"),
            ("human", hum_tmpl)
        ])
        
        # 3. Format with variables from the State (Summary & Context)
        formatted_prompt = prompt.format_messages(
            context=context,
            summary=state.get("summary", "No summary."),
            chat_history=chat_history,
            query=state["messages"][-1].content
        )
        # 4. Invoke the LLM with the formatted prompt
        response = await llm.ainvoke(formatted_prompt)

        return {"messages": [response]}

    except Exception as e:
        return {
            "messages": [
                {
                    "role": "assistant",
                    "content": f"Error loading knowledge base: {str(e)}",
                }
            ]
        }
    
