from src.retrieval.retriever import (
    retrieve_context
)

from src.generation.citations import (
    extract_citations,
    format_citations
)


result = retrieve_context(
    "What is the Earth Return Orbiter?"
)

metadata = result["metadatas"][0]

citations = extract_citations(
    metadata
)

formatted_sources = format_citations(
    citations
)

print("\nFORMATTED SOURCES\n")

print(formatted_sources)