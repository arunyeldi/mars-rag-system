import json

from datasets import Dataset


def build_ragas_dataset():

    with open(
        "data/evaluation/results.json",
        encoding="utf-8"
    ) as f:

        results = json.load(f)

    data = {
        "question": [],
        "answer": [],
        "ground_truth": [],
        "contexts": []
    }

    for item in results:

        data["question"].append(
            str(item["question"])
        )

        data["answer"].append(
            str(item["answer"])
        )

        data["ground_truth"].append(
            str(item["ground_truth"])
        )

        data["contexts"].append(
            item["contexts"]
        )

    return Dataset.from_dict(data)