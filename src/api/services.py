from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)


def run_rag_pipeline(
    question: str
):

    context = get_context_text(
        question
    )

    answer = generate_answer(
        question,
        context
    )

    return {
        "answer": answer,
        "sources": [
            "mars_report.pdf"
        ]
    }