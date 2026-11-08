from openai import AzureOpenAI

from src.config import (
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_API_VERSION,
    AZURE_OPENAI_CHAT_DEPLOYMENT
)

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_version=AZURE_OPENAI_API_VERSION
)


def generate_answer(
    question: str,
    context: str
):

    prompt = f"""
You are a NASA research assistant.

Answer ONLY using the provided context.

If the answer is not available
in the context, respond:

'I could not find sufficient information
in the NASA documents.'

Context:
{context}

Question:
{question}
"""

    response = client.chat.completions.create(
        model=AZURE_OPENAI_CHAT_DEPLOYMENT,

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0
    )

    return (
        response
        .choices[0]
        .message
        .content
    )