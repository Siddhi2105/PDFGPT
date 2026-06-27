# DocMind

> AI-powered PDF chatbot built using **Retrieval-Augmented Generation (RAG)**, **FastAPI**, **React**, **FAISS**, and **Google Gemini**.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![FAISS](https://img.shields.io/badge/FAISS-Vector%20Database-orange)
![Gemini](https://img.shields.io/badge/Google-Gemini-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Overview

DocMind is an AI-powered document assistant that enables users to upload PDF files and interact with them using natural language.

The application uses **Retrieval-Augmented Generation (RAG)** to retrieve semantically relevant document chunks using **FAISS** and generates context-aware responses using **Google Gemini**, allowing users to explore documents conversationally.

---

## Features

* Upload and manage multiple PDF documents
* Natural language question answering
* Retrieval-Augmented Generation (RAG)
* Semantic search using FAISS
* Automatic document chunking
* Integrated PDF viewer
* Persistent vector storage
* Chat history support
* REST API powered by FastAPI
* Modern React-based user interface
* Cloud deployment with Render and Vercel

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

| Category            | Technologies             |
| ------------------- | ------------------------ |
| **Frontend**        | React, Vite, Axios       |
| **Backend**         | FastAPI                  |
| **Vector Database** | FAISS                    |
| **AI Models**       | Google Gemini            |
| **PDF Processing**  | PyPDF                    |
| **Text Processing** | LangChain Text Splitters |
| **Deployment**      | Render, Vercel           |

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

Uploaded PDF files are parsed using PyPDF, and the extracted text is divided into semantic chunks.

### 2. Embedding Generation

Each document chunk is converted into vector embeddings using Google's Gemini Embedding Model.

### 3. Vector Storage

Embeddings are stored inside a FAISS vector database for efficient semantic retrieval.

### 4. Context Retrieval

When a question is asked, the query is embedded and compared against the stored vectors to retrieve the most relevant document chunks.

### 5. Response Generation

The retrieved context is combined with the user's question and passed to Gemini to generate an answer grounded in the uploaded document.

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
Retrieve Relevant Chunks
      │
      ▼
Prompt Construction
      │
      ▼
Gemini LLM
      │
      ▼
Final Answer
```

---

## API Endpoints

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/`                      | Health Check       |
| POST   | `/upload`                | Upload PDF         |
| GET    | `/pdf-list`              | List Uploaded PDFs |
| DELETE | `/delete-pdf/{filename}` | Delete PDF         |
| POST   | `/ask`                   | Ask Questions      |
| POST   | `/clear-chat`            | Clear Chat History |

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

## Configuration

Before running the application, create the required environment variable files for both the backend and frontend and configure them with your own credentials and API keys.

---

## Future Improvements

* User authentication
* OCR support for scanned PDFs
* Streaming AI responses
* Source highlighting within PDFs
* Hybrid Search (BM25 + Vector Search)
* Conversation memory
* Database integration
* Multi-agent RAG architecture

---

## License

This project is licensed under the **MIT License**.
