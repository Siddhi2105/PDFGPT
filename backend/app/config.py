import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Embedding model
embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# Upload folder
UPLOAD_FOLDER = "uploaded_pdfs"

# Files
DOCUMENTS_FILE = "documents.pkl"
INDEX_FILE = "faiss_index.bin"
VECTOR_DB = "vector_db"