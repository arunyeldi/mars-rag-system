from src.storage.chroma_store import (
    collection
)

print(
    "Total Chunks:",
    collection.count()
)