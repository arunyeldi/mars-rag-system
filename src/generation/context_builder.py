from src.retrieval.context_builder import (
    build_context
)


def get_context_with_sources(
    question
):

    chunks = build_context(
        question
    )

    context_text = "\n\n".join(
        chunk["text"]
        for chunk in chunks
    )

    sources = []

    for chunk in chunks:

        sources.append(
            f'{chunk["document"]} '
            f'(chunk {chunk["chunk_id"]})'
        )

    return (
        context_text,
        list(set(sources))
    )