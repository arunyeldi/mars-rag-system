from src.generation.context_builder import (
    get_context_text
)

from src.generation.generator import (
    generate_answer
)

from src.retrieval.retriever import (
    retrieve_context
)

from src.generation.response_builder import (
    build_response
)

question = (
    "What is the purpose of the Earth Return Orbiter?"
)

retrieval_result = retrieve_context(
    question
)

metadata = retrieval_result[
    "metadatas"
][0]

context = get_context_text(
    question
)

answer = generate_answer(
    question,
    context
)

print("\nQUESTION:")
print(question)

final_response = build_response(
    answer,
    metadata
)

print("\nANSWER:\n")

print(final_response)