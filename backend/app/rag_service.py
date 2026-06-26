import numpy as np
import faiss
import google.generativeai as genai

from .config import embedding_model
from .vector_store import load_documents
from .llm_service import generate_answer
from .retriever import retrieve_context


def ask_rag(question, pdf_name, history):

    history_text = ""

    for chat in history:
        history_text += (
            f"User: {chat['question']}\n"
            f"Assistant: {chat['answer']}\n\n"
        )

    documents = load_documents()

    if len(documents) == 0:
        return None

    context, sources = retrieve_context(
        documents,
        question,
        pdf_name
    )

    answer = generate_answer(
        context=context,
        question=question,
        history_text=history_text
    )

    return {
        "answer": answer,
        "sources": sources
    }