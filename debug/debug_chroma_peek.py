# debug/debug_chroma_peek.py

from src.storage.chroma_store import collection

print(collection.count())

result = collection.peek()

print(result.keys())

print(result)