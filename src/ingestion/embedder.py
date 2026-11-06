from openai import AzureOpenAI
from src.config import *

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_version=AZURE_OPENAI_API_VERSION
)

def create_embeddings(texts):

    try:

        response = client.embeddings.create(
            model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
            input=texts
        )

        return [
            item.embedding
            for item in response.data
        ]

    except Exception as e:

        print(
            f"Embedding generation failed: {e}"
        )

        raise