from src.retrieval.retriever import (
    retrieve_context
)

question = (
    "What is the purpose of the Earth Return Orbiter?"
)

results = retrieve_context(
    question
)

documents = results["documents"][0]
metadatas = results["metadatas"][0]

distances = results["distances"][0]

for i, doc in enumerate(documents):

    print("=" * 80)

    print(
        f"Distance: {distances[i]}"
    )

    print(
        metadatas[i]
    )

    print(doc[:500])