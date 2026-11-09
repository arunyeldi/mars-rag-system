from src.evaluation.latency import (
    measure_execution_time
)

from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)

question = (
    "What is the Earth Return Orbiter?"
)


def run_pipeline():

    context = get_context_text(
        question
    )

    answer = generate_answer(
        question,
        context
    )

    return answer


answer, latency = (
    measure_execution_time(
        run_pipeline
    )
)

print()
print(
    f"End To End Latency: "
    f"{latency} seconds"
)

print()
print(answer)