from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()



llm=ChatGoogleGenerativeAI(

model="gemini-2.5-flash",

temperature=0

)



def summarizer_node(state):


    messages=state["messages"]


    if len(messages)<=6:

        return {}



    old=messages[:-3]


    prompt=f"""

Summarize this conversation:

{old}

Existing summary:

{state.get("summary","")}

"""


    result=llm.invoke(
        prompt
    )


    return {

    "summary":result.content

    }