import json


with open(
    "data/evaluation/results.json",
    encoding="utf-8"
) as f:
    results = json.load(f)

total_questions = len(results)

avg_latency = round(
    sum(
        item["latency"]
        for item in results
    ) / total_questions,
    2
)

avg_score = round(
    sum(
        item["source_score"]
        for item in results
    ) / total_questions,
    2
)

best_score = max(
    item["source_score"]
    for item in results
)

worst_score = min(
    item["source_score"]
    for item in results
)

failed = [
    item
    for item in results
    if item["source_score"] < 0.60
]

print("\n===== NASA RAG REPORT =====")

print(
    f"\nQuestions: {total_questions}"
)

print(
    f"Average Latency: {avg_latency}s"
)

print(
    f"Average Source Score: {avg_score}"
)

print(
    f"Best Score: {best_score}"
)

print(
    f"Worst Score: {worst_score}"
)

print(
    f"Failures: {len(failed)}"
)