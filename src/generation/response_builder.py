from src.generation.citations import (
    extract_citations,
    format_citations
)


def build_response(
    answer,
    metadata
):

    citations = extract_citations(
        metadata
    )

    formatted_sources = format_citations(
        citations
    )

    final_response = (
        f"{answer}"
        f"\n\n"
        f"Sources:\n"
        f"{formatted_sources}"
    )

    return final_response