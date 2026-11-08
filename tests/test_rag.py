from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
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

print("\nQUESTION:")
print(question)

print("\nANSWER:")
print(answer)