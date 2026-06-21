# AI PDF Chatbot

An AI-powered PDF Chatbot that enables users to upload PDF documents and ask natural language questions about their content.

The application uses Retrieval-Augmented Generation (RAG) to retrieve relevant document chunks through semantic search and generates context-aware responses using Google's Gemini AI.

## Features

* Upload and manage multiple PDF documents
* Semantic search using Sentence Transformers embeddings
* FAISS vector database for fast similarity search
* Context-aware question answering with Gemini AI
* Interactive PDF viewer
* Chat history support
* PDF selection and deletion
* Responsive modern React UI

## Tech Stack

### Frontend

* React.js
* Axios
* Tailwind CSS
* React Icons

### Backend

* FastAPI
* Google Gemini API
* FAISS
* Sentence Transformers
* PyPDF
* LangChain Text Splitter

## How It Works

1. User uploads a PDF.
2. PDF text is extracted and split into chunks.
3. Chunks are converted into vector embeddings using Sentence Transformers.
4. Embeddings are stored in a FAISS vector index.
5. User asks a question.
6. Relevant chunks are retrieved using semantic similarity search.
7. Retrieved context is sent to Gemini AI.
8. Gemini generates an answer based on the retrieved document content.

## Future Improvements

* User authentication
* Cloud storage (AWS S3 / Cloudinary)
* Persistent vector databases (Pinecone, Qdrant, ChromaDB)
* Streaming responses
* Citation highlighting
* Multi-document reasoning
* Chat export functionality
