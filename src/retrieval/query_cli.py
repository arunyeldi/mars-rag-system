from src.retrieval.retriever import (
    retrieve_context
)

while True:

    query = input(
        "\nAsk NASA Question: "
    )

    if query.lower() == "exit":
        break

    results = retrieve_context(
        query
    )

    docs = results["documents"][0]

    print("\nRetrieved Chunks:\n")

    for i, doc in enumerate(docs):

        print(
            f"\nResult {i+1}"
        )

        print(
            doc[:400]
        )