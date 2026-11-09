from src.storage.chroma_store import (
    collection
)

results = collection.get(
    limit=1,
    include=[
        "documents",
        "metadatas",
        "embeddings"
    ]
)

print("ID:")
print(results["ids"][0])

print("\nMetadata:")
print(results["metadatas"][0])

print("\nDocument Preview:")
print(results["documents"][0][:300])

print("\nEmbedding Length:")
print(
    len(results["embeddings"][0])
)