from src.retrieval.context_builder import (
    build_context
)

question = (
    "What is the purpose of Earth Return Orbiter?"
)

context = build_context(
    question
)

print(
    f"Retrieved {len(context)} chunks"
)

for idx, chunk in enumerate(
    context
):

    print("\n")
    print("=" * 80)

    print(
        f"Chunk {idx + 1}"
    )

    print(chunk[:500])