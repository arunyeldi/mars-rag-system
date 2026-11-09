from src.retrieval.hybrid_retriever import (
    HybridRetriever
)

from src.retrieval.retriever import (
    has_good_similarity
)

def build_context(
    query
):

    retriever = HybridRetriever()

    results = retriever.search(
        query
    )
    
    # semantic_results = results["semantic"]

    # if not has_good_similarity(
    #     semantic_results
    # ):
    #     return []

    context = []

    semantic_docs = (
        results["semantic"]["documents"][0]
    )

    semantic_metadata = (
        results["semantic"]["metadatas"][0]
    )

    for doc, metadata in zip(
        semantic_docs,
        semantic_metadata
    ):

        context.append(
            {
                "text": doc,
                "document":
                    metadata["document"],

                "chunk_id":
                    metadata["chunk_id"]
            }
        )

    for record in results["bm25"]:

        context.append(
            {
                "text":
                    record["chunk"]["text"],

                "document":
                    record["chunk"]["document"],

                "chunk_id":
                    record["chunk"]["chunk_id"]
            }
        )

    return context