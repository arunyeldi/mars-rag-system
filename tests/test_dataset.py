import json

with open(
    "data/evaluation/golden_dataset.json",
    encoding="utf-8"
) as f:

    dataset = json.load(f)

print(f"Questions: {len(dataset)}")

print("\nFirst Question:")

print(dataset[0]["question"])

print("\nGround Truth:")

print(dataset[0]["ground_truth"])