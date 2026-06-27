import os
from dotenv import load_dotenv
import google.genai as genai

load_dotenv()

# Configure Gemini
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={"api_version": "v1"}
)

UPLOAD_FOLDER = "uploaded_pdfs"

DOCUMENTS_FILE = "documents.pkl"

INDEX_FILE = "faiss_index.bin"

VECTOR_DB = "vector_db"


def get_embedding(text: str):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values


def get_query_embedding(text: str):
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values