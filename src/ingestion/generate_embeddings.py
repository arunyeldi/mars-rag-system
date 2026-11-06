import json

from src.ingestion.embedder import (
    create_embeddings
)

with open(
    "data/chunks/mars_chunks.json",
    encoding="utf-8"
) as f:
    chunks = json.load(f)

texts = [
    chunk["text"]
    for chunk in chunks
]

embeddings = create_embeddings(
    texts
)

print(
    f"Generated {len(embeddings)} embeddings"
)

print(
    f"Embedding Dimension: {len(embeddings[0])}"
)