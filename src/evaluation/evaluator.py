import json

from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)

from src.evaluation.latency import (
    measure_execution_time
)

from src.evaluation.source_validator import (
    validate_sources
)


def evaluate_dataset():

    with open(
        "data/evaluation/golden_dataset.json",
        encoding="utf-8"
    ) as file:

        dataset = json.load(file)

    results = []

    for item in dataset:

        question = item["question"]

        print(f"\nProcessing: {question}")

        def run_pipeline():

            context = get_context_text(
                question
            )

            answer = generate_answer(
                question,
                context
            )

            score = validate_sources(
                answer,
                context
            )

            if score < 0.60:

                from src.evaluation.failure_logger import (
                    log_failure
                )

                log_failure(
                    {
                        "question": question,
                        "answer": answer,
                        "source_score": score
                    }
                )

            return (
                answer,
                context
            )

        (
            result,
            latency
        ) = measure_execution_time(
            run_pipeline
        )

        answer, context = result

        score = validate_sources(
            answer,
            context
        )

        results.append(
            {
                "question": question,
                "answer": answer,
                "latency": latency,
                "source_score": score
            }
        )

    return results