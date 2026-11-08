from src.retrieval.hybrid_retriever import (
    HybridRetriever
)


def build_context(
    query
):

    retriever = HybridRetriever()

    results = retriever.search(
        query
    )

    context = []

    semantic_docs = (
        results["semantic"]
        ["documents"][0]
    )

    context.extend(
        semantic_docs
    )

    for record in results["bm25"]:

        context.append(
            record["chunk"]["text"]
        )

    return list(
        set(context)
    )