from src.generation.guardrails import (
    has_sufficient_context
)


def test_empty_context():

    assert (
        has_sufficient_context("")
        is False
    )


def test_valid_context():

    context = (
        "Mars Sample Return mission "
        * 20
    )

    assert (
        has_sufficient_context(context)
        is True
    )