def validate_answer_source(
    answer,
    retrieved_chunks
):
    """
    Measure how much of the answer
    is supported by retrieved context.
    """

    answer_words = set(
        answer.lower().split()
    )

    context_words = set()

    for chunk in retrieved_chunks:

        context_words.update(
            chunk.lower().split()
        )

    overlap = len(
        answer_words.intersection(
            context_words
        )
    )

    score = overlap / max(
        len(answer_words),
        1
    )

    return round(score, 2)