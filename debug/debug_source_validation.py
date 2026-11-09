from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)

from src.evaluation.source_validator import (
    validate_sources
)

question = (
    "What is the purpose of the Earth Return Orbiter?"
)

context = get_context_text(
    question
)

answer = generate_answer(
    question,
    context
)

score = validate_sources(
    answer,
    [context]
)

print("\nANSWER:\n")

print(answer)

print("\nSOURCE SCORE:\n")

print(score)