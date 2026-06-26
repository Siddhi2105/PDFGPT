import google.generativeai as genai


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

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)

    return response.text