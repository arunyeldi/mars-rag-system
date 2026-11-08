from pathlib import Path


def log_failure(item):

    failure_file = Path(
        "data/failures/failure_log.md"
    )

    with open(
        failure_file,
        "a",
        encoding="utf-8"
    ) as f:

        f.write(
            f"""
## Failed Question

Question:
{item["question"]}

Score:
{item["source_score"]}

Answer:
{item["answer"]}

--------------------------------
"""
        )