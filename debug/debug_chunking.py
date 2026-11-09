import json


with open(
    "data/chunks/mars_chunks.json",
    encoding="utf-8"
) as f:
    chunks = json.load(f)

print("Total Chunks:", len(chunks))

print("\nFirst Chunk:\n")

print(chunks[0]["text"][:500])