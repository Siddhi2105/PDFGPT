import os
import pickle
import faiss
import numpy as np

from .config import (
    get_embedding,
    get_query_embedding,
    DOCUMENTS_FILE,
    INDEX_FILE,
)


def save_documents(documents):

    with open(DOCUMENTS_FILE, "wb") as f:
        pickle.dump(documents, f)


def load_documents():

    if not os.path.exists(DOCUMENTS_FILE):
        return []

    with open(DOCUMENTS_FILE, "rb") as f:
        return pickle.load(f)


def build_index(documents):

    texts = [doc["text"] for doc in documents]

    embeddings = np.array(
        [get_embedding(text) for text in texts],
        dtype=np.float32
    )

    index = faiss.IndexFlatL2(
        embeddings.shape[1]
    )

    index.add(embeddings)

    faiss.write_index(
        index,
        INDEX_FILE
    )


def load_index():

    if not os.path.exists(INDEX_FILE):
        return None

    return faiss.read_index(
        INDEX_FILE
    )


def search_index(question, k=3):

    index = load_index()

    if index is None:
        return None, None

    query_embedding = np.array(
        [get_query_embedding(question)],
        dtype=np.float32
    )

    distances, indices = index.search(query_embedding, k)

    return distances, indices