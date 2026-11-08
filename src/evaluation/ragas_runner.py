from ragas import evaluate

from ragas.metrics import (
    faithfulness,
    answer_relevancy
)

from src.evaluation.ragas_dataset_builder import (
    build_ragas_dataset
)


dataset = build_ragas_dataset()

results = evaluate(
    dataset=dataset,

    metrics=[
        faithfulness,
        answer_relevancy
    ]
)

print()

print(results)