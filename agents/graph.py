import os
from typing import Annotated, TypedDict, List,Any
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import RemoveMessage, SystemMessage
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI
from .ingestion import ingestion_node
from .indexing import indexing_node
from .qa_specialist import qa_node
from .summarizing import summarizer_node
from langgraph.checkpoint.memory import MemorySaver
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver


class AgentState(TypedDict):
    
    messages: Annotated[List, add_messages]
    session_id: str
    file_path: str
    context: List[Any]
    summary: str 


def route_request(state):
    """
    Decides where to start based on input.
    - Has 'file_path'? -> Upload Mode
    - No 'file_path'?  -> Q&A Mode
    """
    if state.get("file_path"):
        return "ingestion"
    return "qa"


# Build Workflow
def build_workflow():
    
    workflow = StateGraph(AgentState)
    
    # --- Add Nodes ---
    workflow.add_node("ingestion", ingestion_node)
    workflow.add_node("indexing", indexing_node)
    workflow.add_node("qa", qa_node)
    workflow.add_node("summarize", summarizer_node)
    
    # --- Set Entry Point ---
    workflow.set_conditional_entry_point(
        route_request,
        {
            "ingestion": "ingestion", # If uploading, start here
            "qa": "qa"                # If asking, start here
        }
    )
    
    # --- PATH 1: Upload Flow ---
    workflow.add_edge("ingestion", "indexing")
    workflow.add_edge("indexing", END) 
    
    # --- PATH 2: Q&A Flow ---
    # After QA, go to Summarize 
    workflow.add_edge("qa", "summarize")
    
    # After Summarize, STOP.
    workflow.add_edge("summarize", END)
    
    return workflow