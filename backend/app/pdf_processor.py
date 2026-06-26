import os
import shutil

from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .config import UPLOAD_FOLDER


def process_pdf(file):

    # Save PDF
    pdf_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file.file.seek(0)

    reader = PdfReader(file.file)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    documents = []

    for page_number, page in enumerate(reader.pages):
        page_text = page.extract_text()

        if not page_text:
            continue

        chunks = splitter.split_text(page_text)

        for chunk in chunks:
            documents.append({
                "text": chunk,
                "source": file.filename,
                "page": page_number + 1
            })

    return documents