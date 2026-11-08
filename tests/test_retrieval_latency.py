from src.retrieval.retriever import (
    retrieve_context
)

from src.evaluation.latency import (
    measure_execution_time
)

query = (
    "What is the purpose of the Earth Return Orbiter?"
)

results, latency = (
    measure_execution_time(
        retrieve_context,
        query
    )
)

print()
print(
    f"Retrieval Latency: "
    f"{latency} seconds"
)