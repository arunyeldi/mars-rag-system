from src.ingestion.embedder import create_embeddings


sample_texts = [
    "Mars Sample Return mission",
    "Earth Return Orbiter"
]

embeddings = create_embeddings(
    sample_texts
)

print(f"Embeddings Generated: {len(embeddings)}")

print(
    f"Vector Length: {len(embeddings[0])}"
)

print(
    f"First 5 Values:\n{embeddings[0][:5]}"
)