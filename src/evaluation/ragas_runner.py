from ragas import evaluate

from ragas.metrics import (
    faithfulness,
    answer_relevancy
)

from src.evaluation.ragas_dataset_builder import (
    build_ragas_dataset
)

from src.evaluation.ragas_azure import (
    azure_llm, azure_embeddings
)


dataset = build_ragas_dataset()

print(dataset)

print(dataset.features)

results = evaluate(
    dataset=dataset,
    metrics=[
        answer_relevancy
    ],
    llm=azure_llm,
    embeddings=azure_embeddings
)

print()

print(results)