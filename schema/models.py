from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    session_id: str
    status: str
    message: str

class QueryRequest(BaseModel):
    session_id: str
    question: str
 
class QueryResponse(BaseModel):   
    answer: str
    agent_logs: Optional[List[str]] 