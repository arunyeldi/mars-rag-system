def sufficient_context(
    retrieval_results
):

    distances = (
        retrieval_results["distances"][0]
    )

    best_distance = min(
        distances
    )

    return best_distance < 0.5