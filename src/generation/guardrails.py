NO_ANSWER_MESSAGE = (
    "I could not find sufficient information in the NASA documents."
)


def has_sufficient_context(
    context: str
):

    if not context:
        return False

    if len(context.strip()) < 100:
        return False

    return True

