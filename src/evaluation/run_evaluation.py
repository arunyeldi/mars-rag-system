import json

from src.evaluation.evaluator import (
    evaluate_dataset
)

print(
    "\nStarting evaluation..."
)

results = evaluate_dataset()

with open(
    "data/evaluation/results.json",
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        results,
        file,
        indent=4,
        ensure_ascii=False
    )

print(
    "\nResults saved successfully."
)