from src.retrieval.hybrid_retriever import (
    HybridRetriever
)

retriever = HybridRetriever()

results = retriever.search(
    "Earth Return Orbiter"
)

print(results.keys())