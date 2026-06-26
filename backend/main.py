import traceback

from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.rag_service import ask_rag
from app.pdf_processor import process_pdf

import os
# =========================
# CONFIG
# =========================
from app.vector_store import (
    save_documents,
    load_documents,
    build_index,
)
from app.config import (
    UPLOAD_FOLDER,
    DOCUMENTS_FILE,
)
app = FastAPI()
chat_history = []

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.mount(
    "/pdfs",
    StaticFiles(directory=UPLOAD_FOLDER),
    name="pdfs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }
# =========================
# UPLOAD PDF
# =========================

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...)
):
    try:
        new_documents = process_pdf(file)

        # Load existing documents
        all_documents = load_documents()

        # Remove old chunks of same PDF
        all_documents = [
            doc
            for doc in all_documents
            if doc["source"] != file.filename
        ]

        # Add fresh chunks
        all_documents.extend(new_documents)

        # Save documents
        save_documents(all_documents)
        build_index(all_documents)
        return {
            "success": True,
            "filename": file.filename,
            "chunks_added": len(new_documents),
            "total_chunks": len(all_documents),
            "message": "PDF added successfully"
        }

    except Exception as e:
        traceback.print_exc()

        return {
            "success": False,
            "error": str(e)
        }
@app.delete("/delete-pdf/{filename}")
async def delete_pdf(filename: str):
    try:

        pdf_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        if not os.path.exists(pdf_path):
            return {
                "success": False,
                "error": "PDF not found"
            }

        # Delete PDF file
        os.remove(pdf_path)

        # Remove chunks from documents.pkl
        documents = []

        if os.path.exists(DOCUMENTS_FILE):

            documents = load_documents()

            documents = [
                doc
                for doc in documents
                if doc["source"] != filename
            ]

            save_documents(documents)

        if len(documents) > 0:
            build_index(documents)

        return {
            "success": True,
            "message": "PDF deleted successfully"
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "success": False,
            "error": str(e)
        }

# =========================
# LIST DOCUMENT NAMES
# =========================

@app.get("/documents")
async def get_documents():

    documents = load_documents()

    filenames = list(
        set(
            doc["source"]
            for doc in documents
        )
    )

    return {
        "documents": filenames
    }

# =========================
# PDF LIST WITH URLS
# =========================

@app.get("/pdf-list")
async def pdf_list():

    files = []

    if os.path.exists(
        UPLOAD_FOLDER
    ):

        for file in os.listdir(
            UPLOAD_FOLDER
        ):

            files.append({
                "name": file,
                "url": f"http://127.0.0.1:8000/pdfs/{file}"
            })

    return {
        "files": files
    }

# =========================
# ASK QUESTION
# =========================

@app.post("/ask")
async def ask_question(
    data: dict = Body(...)
):
    try:
        question = data["question"]
        result = ask_rag(
            question=question,
            pdf_name=data.get("pdf_name", ""),
            history=chat_history
        )

        if result is None:
            return {
                "success": False,
                "error": "Selected PDF not found"
            }

        chat_history.append({
    "question": question,
    "answer": result["answer"]
})

        return {
    "success": True,
    "answer": result["answer"],
    "sources": result["sources"]
}

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# =========================
# CLEAR CHAT
# =========================

@app.post("/clear-chat")
async def clear_chat():

    global chat_history

    chat_history = []

    return {
        "success": True,
        "message": "Chat history cleared"
    }
