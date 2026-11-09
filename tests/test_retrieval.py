from src.retrieval.retriever import (
    retrieve_context
)


def test_retrieve_context():

    result = retrieve_context(
        "Earth Return Orbiter"
    )

    assert result is not None

    assert len(
        result["documents"][0]
    ) > 0