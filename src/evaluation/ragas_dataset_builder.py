import json
import pandas as pd
from datasets import Dataset


def build_ragas_dataset():

    with open(
        "data/evaluation/results.json",
        encoding="utf-8"
    ) as file:

        results = json.load(file)

    with open(
        "data/evaluation/golden_dataset.json",
        encoding="utf-8"
    ) as file:

        golden = json.load(file)

    rows = []

    for result, truth in zip(
        results,
        golden
    ):

        rows.append(
            {
                "question":
                    result["question"],

                "answer":
                    result["answer"],

                "ground_truth":
                    truth["ground_truth"],

                "contexts":
                    ["placeholder"]
            }
        )

    dataframe = pd.DataFrame(rows)

    return Dataset.from_pandas(
        dataframe
    )