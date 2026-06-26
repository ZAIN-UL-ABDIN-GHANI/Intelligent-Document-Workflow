import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)


for model in client.models.list():

    print("MODEL:", model.name)

    try:
        print("ACTIONS:", model.supported_actions)
    except:
        print("ACTIONS: not available")

    print("----------------------")