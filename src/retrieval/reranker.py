from openai import AzureOpenAI

from src.config import (
    AZURE_OPENAI_API_KEY,
    AZURE_OPENAI_API_VERSION,
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_CHAT_DEPLOYMENT
)

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_version=AZURE_OPENAI_API_VERSION
)


def rerank_chunks(
    query,
    chunks
):

    ranked_chunks = []

    for chunk in chunks:

        prompt = f"""
Question:
{query}

Chunk:
{chunk}

Rate relevance between 0 and 100.

Return only a number.
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

        score = int(
            response.choices[0]
            .message.content.strip()
        )

        ranked_chunks.append(
            {
                "score": score,
                "chunk": chunk
            }
        )

    ranked_chunks.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return ranked_chunks