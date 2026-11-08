from src.storage.chroma_store import (
    collection
)

result = collection.peek()

print(result.keys())

print("\nMetadata:\n")

print(result["metadatas"][0])