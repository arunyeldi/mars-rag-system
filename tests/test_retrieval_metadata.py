from src.retrieval.retriever import (
    retrieve_context
)

result = retrieve_context(
    "What is the Earth Return Orbiter?"
)

print("\nDOCUMENTS\n")

print(result["documents"][0][0][:300])

print("\nMETADATA\n")

print(result["metadatas"][0][0])