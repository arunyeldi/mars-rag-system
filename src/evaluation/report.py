import json


with open(
    "data/evaluation/results.json",
    encoding="utf-8"
) as file:

    results = json.load(file)

latencies = [
    item["latency"]
    for item in results
]

avg_latency = (
    sum(latencies)
    / len(latencies)
)

print(
    f"Average Latency: "
    f"{round(avg_latency, 2)} sec"
)

print(
    f"Min Latency: "
    f"{min(latencies)} sec"
)

print(
    f"Max Latency: "
    f"{max(latencies)} sec"
)