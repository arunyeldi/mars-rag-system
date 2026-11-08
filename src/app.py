from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)

while True:

    question = input(
        "\nAsk NASA Question: "
    )

    if question.lower() == "exit":
        break

    context = get_context_text(
        question
    )

    answer = generate_answer(
        question,
        context
    )

    print("\n")
    print(answer)