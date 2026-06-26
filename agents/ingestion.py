import os
import base64
import fitz

from dotenv import load_dotenv

from langchain_core.documents import Document
from langchain_core.messages import HumanMessage

from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv()



vision_llm = ChatGoogleGenerativeAI(

    model="gemini-2.5-flash-lite",

    temperature=0

)



async def ingestion_node(state):


    file_path = state.get(
        "file_path"
    )


    docs=[]


    if not file_path:

        return {
            "context":[],
            "messages":[]
        }



    ext=file_path.split(".")[-1].lower()

    filename=os.path.basename(file_path)



    try:


        if ext=="pdf":


            pdf=fitz.open(file_path)


            for i,page in enumerate(pdf):


                text=page.get_text()


                if not text.strip():


                    pix=page.get_pixmap()

                    img=base64.b64encode(
                        pix.tobytes("png")
                    ).decode()



                    msg=HumanMessage(

                    content=[

                    {
                    "type":"text",
                    "text":"Extract all text from image"
                    },

                    {
                    "type":"image_url",
                    "image_url":{
                    "url":f"data:image/png;base64,{img}"
                    }
                    }

                    ]

                    )


                    result=await vision_llm.ainvoke(
                        [msg]
                    )

                    text=result.content



                docs.append(

                    Document(

                    page_content=text,

                    metadata={
                    "page":i+1,
                    "source":filename
                    }

                    )

                )



        return {

            "context":docs,

            "messages":[
                "Ingestion completed"
            ]

        }


    except Exception as e:


        return {

        "context":[],

        "messages":[
        f"Error {e}"
        ]

        }