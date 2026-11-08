import json

from src.evaluation.latency import (
    measure_execution_time
)

from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)


def evaluate():

    with open(
        "data/evaluation/golden_dataset.json",
        encoding="utf-8"
    ) as file:

        dataset = json.load(file)

    results = []

    for item in dataset:

        question = item["question"]

        def run_query():

            context = get_context_text(
                question
            )

            return generate_answer(
                question,
                context
            )

        answer, latency = (
            measure_execution_time(
                run_query
            )
        )

        results.append(
            {
                "question": question,
                "answer": answer,
                "latency": latency
            }
        )

    return results
