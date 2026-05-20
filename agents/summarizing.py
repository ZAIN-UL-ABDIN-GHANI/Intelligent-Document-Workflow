import os
from langchain_core.messages import RemoveMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv


load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_tokens=514,
)


def summarizer_node(state):
    """
    Summarizes older messages, keeps the last 3, and deletes the summarized ones.
    """
    messages = state["messages"]

    if len(messages) > 6:

        # 1. Define split: Keep last 3, summarize the rest
        to_keep = messages[-3:]
        to_summarize = messages[:-3]

        if not to_summarize:
            return {}

        # 2. Generate Summary (Include existing summary to maintain history)
        existing_summary = state.get("summary", "")
        prompt = f"""
        Current Summary: {existing_summary}
        New conversation to merge: {to_summarize}
        
        Update the summary to include the new conversation details concisely.
        """

      
        summary_response = llm.invoke(prompt)
        new_summary = summary_response.content
        print("--- GENERATED NEW SUMMARY ---")

        # 3. Create Delete Operations
        delete_messages = [RemoveMessage(id=m.id) for m in to_summarize]

        return {
            "summary": new_summary,
            "messages": delete_messages,  
        }

    return {}
