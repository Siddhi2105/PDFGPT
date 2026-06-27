# 📄 DocMind – AI Powered PDF Chatbot

> Chat with your PDF documents using Retrieval-Augmented Generation (RAG), FastAPI, React, FAISS, and Google Gemini.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Database-orange)
![Gemini](https://img.shields.io/badge/Google-Gemini-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Overview

DocMind is an AI-powered PDF chatbot that allows users to upload documents and ask natural language questions about their content.

Instead of searching keywords, DocMind understands the document semantically using **Retrieval-Augmented Generation (RAG)**. Relevant sections are retrieved through vector similarity search and passed to Google's Gemini model to generate accurate, context-aware answers.

---

## ✨ Features

- 📂 Upload multiple PDF documents
- 💬 Chat naturally with uploaded PDFs
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic search using FAISS Vector Database
- 📑 Automatic PDF chunking
- 📄 Built-in PDF Viewer
- 🗑️ Delete uploaded PDFs
- 🔄 Persistent vector database
- 🧾 Chat history support
- 📌 Source-aware retrieval
- ⚡ FastAPI backend
- 🎨 Modern React UI
- ☁️ Deployable on Render + Vercel

---

# 🏗 Architecture

```
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
 Chunk Documents       Query Embedding
      │                       │
      ▼                       ▼
 Gemini Embeddings      Gemini Embeddings
      │                       │
      └───────────┬───────────┘
                  ▼
          FAISS Vector Search
                  │
                  ▼
        Relevant Context Chunks
                  │
                  ▼
       Gemini 2.5 Flash LLM
                  │
                  ▼
             Final Answer
```

---

# 🧠 Tech Stack

### Frontend

- React
- Axios
- CSS
- React Icons

### Backend

- FastAPI
- Python
- Google Gemini API
- FAISS
- NumPy
- PyPDF
- LangChain Text Splitters

### Deployment

- Render (Backend)
- Vercel (Frontend)

---

# 📂 Project Structure

```
PDFGPT/
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── llm_service.py
│   │   ├── pdf_processor.py
│   │   ├── rag_service.py
│   │   ├── retriever.py
│   │   └── vector_store.py
│   │
│   ├── uploaded_pdfs/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ How It Works

## 1. Upload PDF

The uploaded PDF is parsed using **PyPDF**.

---

## 2. Text Chunking

Large documents are split into smaller semantic chunks using LangChain's Recursive Character Text Splitter.

---

## 3. Embedding Generation

Each chunk is converted into dense vector embeddings using Google's Gemini Embedding model.

---

## 4. Vector Storage

Embeddings are stored inside a FAISS vector index for efficient similarity search.

---

## 5. Ask Questions

When the user asks a question:

- The query is embedded
- FAISS retrieves the most relevant chunks
- Retrieved context is passed to Gemini
- Gemini generates an answer strictly from the document context

---

# 🔍 Retrieval-Augmented Generation (RAG)

```
User Question
      │
      ▼
Generate Query Embedding
      │
      ▼
Similarity Search (FAISS)
      │
      ▼
Top Matching Chunks
      │
      ▼
Prompt + Context
      │
      ▼
Gemini LLM
      │
      ▼
Answer
```

---

# 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health Check |
| POST | `/upload` | Upload PDF |
| GET | `/pdf-list` | List PDFs |
| DELETE | `/delete-pdf/{filename}` | Delete PDF |
| POST | `/ask` | Ask Question |
| POST | `/clear-chat` | Clear Chat |

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/PDFGPT.git

cd PDFGPT
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Backend `.env`

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Frontend `.env`

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

---

# 📸 Screenshots

> Add screenshots here after deployment.

- Upload PDF
- Ask Questions
- PDF Viewer
- Chat Interface

---

# 🚀 Future Improvements

- Multi-user authentication
- Streaming AI responses
- Per-document FAISS indexes
- Hybrid Search (BM25 + Vector Search)
- OCR support for scanned PDFs
- Conversation memory
- Citation highlighting
- Multi-agent RAG pipeline

---

# 📈 Why This Project?

This project demonstrates practical implementation of modern AI application development by combining:

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Vector Databases
- Large Language Models
- FastAPI APIs
- React Frontend
- Cloud Deployment

It showcases the complete workflow of building production-ready AI applications.

---

# 👨‍💻 Author

**Keval Solankure**

B.Tech CSE (Big Data Analytics)

SRM Institute of Science and Technology

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

# ⭐ If you found this project helpful, consider giving it a star!
