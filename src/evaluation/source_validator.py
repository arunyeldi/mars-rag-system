def validate_sources(
    answer,
    retrieved_context
):
    """
    Measures overlap between
    generated answer and retrieved context.
    """

    answer_words = set(
        answer.lower().split()
    )

    context_words = set(
        retrieved_context.lower().split()
    )

    if len(answer_words) == 0:
        return 0.0

    overlap = (
        answer_words.intersection(
            context_words
        )
    )

    score = (
        len(overlap)
        / len(answer_words)
    )

    return round(score, 2)