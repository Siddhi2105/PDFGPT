from .vector_store import (
    load_documents,
    search_index,
)

def retrieve_context(documents, question, pdf_name=""):
    distances, indices = search_index(
        question,
        k=min(20, len(documents)) if documents else 0,
    )

    if indices is None:
        return "", []

    retrieved_chunks = []
    sources = []

    # indices may be a 2D array (e.g., [[idx1, idx2,...]]). Handle both cases.
    idx_list = indices[0] if hasattr(indices, "__len__") and hasattr(indices[0], "__iter__") else indices

    for idx in idx_list:
        if idx is None:
            continue
        if idx >= len(documents):
            continue

        doc = documents[idx]

        if pdf_name and doc.get("source") != pdf_name:
            continue

        sources.append({
            "pdf": doc.get("source"),
            "page": doc.get("page", "Unknown"),
        })

        retrieved_chunks.append(
            f"""
Source: {doc.get('source')}
Page: {doc.get('page', 'Unknown')}

Content:
{doc.get('text', '')}
"""
        )

        if len(retrieved_chunks) == 5:
            break

    context = "\n\n".join(retrieved_chunks)

    print("\n========== RETRIEVED CONTEXT ==========")
    print(context)
    print("======================================\n")

    return context, sources