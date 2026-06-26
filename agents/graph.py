from typing import Annotated, TypedDict, List, Any

from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

from .ingestion import ingestion_node
from .indexing import indexing_node
from .qa_specialist import qa_node
from .summarizing import summarizer_node



# =========================
# Agent State
# =========================

class AgentState(TypedDict):

    messages: Annotated[List, add_messages]

    session_id: str

    file_path: str

    context: List[Any]

    summary: str



# =========================
# Router
# =========================

def route_request(state: AgentState):

    """
    Decide starting node

    Upload document:
        ingestion -> indexing

    Question:
        qa -> summarize
    """

    if state.get("file_path"):
        return "ingestion"

    return "qa"



# =========================
# Build LangGraph
# =========================

def build_workflow():

    graph = StateGraph(AgentState)


    # -------------------------
    # Add Nodes
    # -------------------------

    graph.add_node(
        "ingestion",
        ingestion_node
    )


    graph.add_node(
        "indexing",
        indexing_node
    )


    graph.add_node(
        "qa",
        qa_node
    )


    graph.add_node(
        "summarize",
        summarizer_node
    )


    # -------------------------
    # Entry Router
    # -------------------------

    graph.set_conditional_entry_point(

        route_request,

        {

            "ingestion": "ingestion",

            "qa": "qa"

        }

    )


    # -------------------------
    # Upload Pipeline
    # -------------------------

    graph.add_edge(

        "ingestion",

        "indexing"

    )


    graph.add_edge(

        "indexing",

        END

    )


    # -------------------------
    # QA Pipeline
    # -------------------------

    graph.add_edge(

        "qa",

        "summarize"

    )


    graph.add_edge(

        "summarize",

        END

    )


    # IMPORTANT:
    # Return graph, NOT compile()
    # because main.py will add checkpointer

    return graph