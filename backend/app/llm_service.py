import google.genai as genai
import os

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_answer(context, question, history_text):

    prompt = f"""
You are a helpful PDF assistant.

Answer ONLY using the provided document context.

If the answer cannot be found in the context, reply exactly:

I could not find that information in the selected PDF.

Do NOT use outside knowledge.
Do NOT mention filenames.
Do NOT mention page numbers.
Do NOT include citations.
Answer naturally and concisely.

Previous Conversation:
{history_text}

Document Context:
{context}

Question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-image",
        contents=prompt
    )

    return response.text