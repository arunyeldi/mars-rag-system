from src.ingestion.embedder import (
    create_embeddings
)

from src.storage.chroma_store import (
    collection
)


def retrieve_context(
    query: str,
    top_k: int = 5
):

    query_embedding = create_embeddings(
        [query]
    )[0]

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=top_k,

        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    return results
