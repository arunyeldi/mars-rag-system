from src.generation.context_builder import (
    get_context_with_sources
)

from src.generation.generator import (
    generate_answer
)

from src.generation.guardrails import (
    has_sufficient_context,
    NO_ANSWER_MESSAGE
)

from src.evaluation.latency import (
    measure_execution_time
)

from src.api.exceptions import (
    RetrievalException,
    GenerationException
)

from src.monitoring.logger import (
    logger
)


def run_rag_pipeline(
    question: str
):

    logger.info(
        f"Question={question}"
    )

    def pipeline():

        # -------------------------
        # RETRIEVAL
        # -------------------------
        try:

            context, sources = (
                get_context_with_sources(
                    question
                )
            )

        except Exception as ex:

            logger.exception(
                f"Retrieval failed | Question={question}"
            )

            raise RetrievalException(
                f"Retrieval failed: {str(ex)}"
            )

        # -------------------------
        # GUARDRAIL V1
        # -------------------------
        if not has_sufficient_context(
            context
        ):

            logger.warning(
                f"GuardrailTriggered | Question={question}"
            )

            return {
                "answer":
                    NO_ANSWER_MESSAGE,

                "sources": []
            }

        logger.info(
            f"Sources={sources}"
        )

        # -------------------------
        # GENERATION
        # -------------------------
        try:

            answer = generate_answer(
                question,
                context
            )

        except Exception as ex:

            logger.exception(
                f"Generation failed | Question={question}"
            )

            raise GenerationException(
                f"Generation failed: {str(ex)}"
            )

        # -------------------------
        # GPT RETURNED NO ANSWER
        # -------------------------
        if (
            "could not find sufficient information"
            in answer.lower()
        ):

            logger.warning(
                f"ModelNoAnswer | Question={question}"
            )

            return {
                "answer":
                    NO_ANSWER_MESSAGE,

                "sources": []
            }

        logger.info(
            f"Answer={answer[:250]}"
        )

        return {
            "answer": answer,
            "sources": sources
        }

    # -------------------------
    # LATENCY
    # -------------------------
    result, latency = (
        measure_execution_time(
            pipeline
        )
    )

    result["latency"] = latency

    logger.info(
        f"Latency={latency}"
    )

    return result