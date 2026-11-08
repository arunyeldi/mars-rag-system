from ragas import evaluate

from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
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
        answer_relevancy,
        faithfulness,
        context_precision,
        context_recall
    ],
    llm=azure_llm,
    embeddings=azure_embeddings
)

print()

print(results)