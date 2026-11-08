from src.generation.generator import (
    generate_answer
)

from src.evaluation.latency import (
    measure_execution_time
)

question = (
    "What is the purpose of the Earth Return Orbiter?"
)

context = """
Earth Return Orbiter captures
the sample container and
returns it to Earth.
"""

answer, latency = (
    measure_execution_time(
        generate_answer,
        question,
        context
    )
)

print()
print(
    f"Generation Latency: "
    f"{latency} seconds"
)

print()
print(answer)