# DocMind

An AI-powered PDF chatbot built using Retrieval-Augmented Generation (RAG), FastAPI, React, FAISS, and Google Gemini.

---

## Overview

DocMind enables users to upload PDF documents and interact with them using natural language. Instead of performing keyword-based search, it retrieves semantically relevant document chunks using vector similarity search and generates accurate responses using Google's Gemini model.

---

## Features

- Upload and manage multiple PDF documents
- Ask questions using natural language
- Retrieval-Augmented Generation (RAG)
- Semantic search with FAISS
- Integrated PDF viewer
- Automatic document chunking
- Persistent vector storage
- Chat history support
- REST API built with FastAPI
- Modern React-based interface
- Cloud deployment with Render and Vercel

---

## Architecture

```text
                User
                  │
                  ▼
           React Frontend
                  │
                  ▼
          FastAPI Backend
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 PDF Processing          User Question
      │                       │
      ▼                       ▼
 Text Chunking        Query Embedding
      │                       │
      ▼                       ▼
 Gemini Embeddings    Gemini Embeddings
      │                       │
      └───────────┬───────────┘
                  ▼
          FAISS Vector Search
                  │
                  ▼
        Relevant Context Chunks
                  │
                  ▼
          Gemini 2.5 Flash
                  │
                  ▼
            Final Response
```

---

## Technology Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- FastAPI
- Python
- Google Gemini API
- FAISS
- NumPy
- PyPDF
- LangChain Text Splitters

### Deployment

- Render
- Vercel

---

## Project Structure

```text
DocMind
│
├── backend
│   ├── app
│   │   ├── config.py
│   │   ├── llm_service.py
│   │   ├── pdf_processor.py
│   │   ├── rag_service.py
│   │   ├── retriever.py
│   │   └── vector_store.py
│   │
│   ├── uploaded_pdfs
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## How It Works

### 1. Document Processing

Uploaded PDFs are parsed using PyPDF, and the extracted text is divided into semantic chunks using LangChain's Recursive Character Text Splitter.

### 2. Embedding Generation

Each chunk is converted into vector embeddings using Google's Gemini Embedding Model.

### 3. Vector Indexing

Embeddings are stored in a FAISS vector index to enable fast semantic similarity search.

### 4. Retrieval

For every user query, an embedding is generated and compared against the stored vectors to retrieve the most relevant document chunks.

### 5. Response Generation

The retrieved context, along with the user question, is passed to Gemini to generate an accurate response grounded in the uploaded document.

---

## RAG Pipeline

```text
User Question
      │
      ▼
Generate Query Embedding
      │
      ▼
FAISS Similarity Search
      │
      ▼
Relevant Document Chunks
      │
      ▼
Prompt Construction
      │
      ▼
Gemini LLM
      │
      ▼
Generated Response
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health Check |
| POST | `/upload` | Upload a PDF |
| GET | `/pdf-list` | List uploaded PDFs |
| DELETE | `/delete-pdf/{filename}` | Delete a PDF |
| POST | `/ask` | Ask questions |
| POST | `/clear-chat` | Clear chat history |

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/DocMind.git
cd DocMind
```

### Backend

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

### Backend

```env
GEMINI_API_KEY=YOUR_API_KEY
```

### Frontend

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## Future Improvements

- User authentication
- OCR support for scanned documents
- Streaming AI responses
- Source highlighting inside PDFs
- Hybrid search (BM25 + Vector Search)
- Conversation memory
- Database integration
- Multi-agent RAG architecture

---

## License

This project is licensed under the MIT License.
