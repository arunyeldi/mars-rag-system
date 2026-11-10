# debug/debug_chroma_query.py

from src.retrieval.retriever import retrieve_context

result = retrieve_context(
    "What is Earth Return Orbiter?"
)

print(result)