import base64
import fitz
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()


os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Initialize Vision Model
vision_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)


async def ingestion_node(state):
    file_path = state.get("file_path")
    if not file_path:
        return {"context": [], "messages": []}  # No ingestion needed

    filename = file_path.split("/")[-1]
    ext = file_path.split(".")[-1].lower()
    docs = []

    try:
        # --- PDF HANDLING ---
        if ext == "pdf":
            doc = fitz.open(file_path)
            for i, page in enumerate(doc):

                text = page.get_text()
                if not text.strip():
                    # Fallback for Scanned PDFs: Render page to image
                    pix = page.get_pixmap()
                    img_data = pix.tobytes("png")
                    image_b64 = base64.b64encode(img_data).decode("utf-8")
                    msg = HumanMessage(
                        content=[
                            {
                                "type": "text",
                                "text": "Transcribe the text from this document page strictly.",
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{image_b64}"
                                },
                            },
                        ]
                    )
                    response = await vision_llm.ainvoke([msg])
                    text = response.content

                docs.append(
                    Document(
                        page_content=text,
                        metadata={"source": filename, "page": i + 1, "type": "pdf"},
                    )
                )

        # --- IMAGE HANDLING ---
        elif ext in ["jpg", "jpeg", "png", "bmp"]:
            print(f"--- PROCESSING IMAGE: {filename} ---")
            with open(file_path, "rb") as f:
                image_bytes = f.read()
                image_b64 = base64.b64encode(image_bytes).decode("utf-8")

            msg = HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": "Transcribe text and describe this image.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
                    },
                ]
            )

            response = await vision_llm.ainvoke([msg])

            docs.append(
                Document(
                    page_content=response.content,
                    metadata={"source": filename, "page": 1, "type": "image"},
                )
            )

        print(f"--- INGESTION SUCCESS: {len(docs)} docs created ---")
        return {"context": docs, "messages": ["Ingestion complete."]}

    except Exception as e:
        print(f"!!! INGESTION ERROR: {str(e)} !!!")

        return {"context": [], "messages": [f"Error during ingestion: {str(e)}"]}
