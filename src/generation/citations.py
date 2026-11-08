def extract_citations(metadata_list):
    """
    Extract citation information
    from retrieval metadata.
    """

    citations = []

    for metadata in metadata_list:

        citation = {
            "document": metadata["document"],
            "chunk_id": metadata["chunk_id"]
        }

        citations.append(citation)

    return citations


def format_citations(citations):
    """
    Converts citations into a
    user-friendly format.
    """

    sources = []

    for citation in citations:

        source = (
            f"- {citation['document']} "
            f"(Chunk {citation['chunk_id']})"
        )

        sources.append(source)

    return "\n".join(sources)