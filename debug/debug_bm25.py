from src.retrieval.bm25_retriever import (
    BM25Retriever
)

retriever = BM25Retriever()

results = retriever.search(
    "Earth Return Orbiter"
)

for result in results:

    print("\n")
    print("=" * 80)

    print(
        "Score:",
        result["score"]
    )

    print(
        result["chunk"]["text"][:400]
    )