from src.retrieval.context_builder import (
    build_context
)


def get_context_text(
    question: str
):

    chunks = build_context(
        question
    )

    return "\n\n".join(chunks)