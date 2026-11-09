from src.evaluation.latency import (
    measure_execution_time
)

from src.generation.context_builder import (
    get_context_with_sources
)

from src.generation.generator import (
    generate_answer
)

from src.api.exceptions import (
    RetrievalException,
    GenerationException
)

from src.generation.guardrails import (
    has_sufficient_context,
    NO_ANSWER_MESSAGE
)


def run_rag_pipeline(question: str):

    def pipeline():

        try:

            context, sources = (
                get_context_with_sources(
                    question
                )
            )

        except Exception as ex:

            raise RetrievalException(
                f"Retrieval failed: {str(ex)}"
            )

        if not has_sufficient_context(
            context
        ):

            return {
                "answer":
                    NO_ANSWER_MESSAGE,

                "sources": [],

                "latency": 0
            }

        try:

            answer = generate_answer(
                question,
                context
            )

        except Exception as ex:

            raise GenerationException(
                f"Generation failed: {str(ex)}"
            )

        return {
            "answer": answer,
            "sources": sources
        }

    result, latency = (
        measure_execution_time(
            pipeline
        )
    )

    result["latency"] = latency

    return result