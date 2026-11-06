import json

from src.ingestion.embedder import (
    create_embeddings
)

from src.storage.chroma_store import (
    collection
)

print("Loading chunks...")

with open(
    "data/chunks/mars_chunks.json",
    encoding="utf-8"
) as f:

    chunks = json.load(f)

texts = [
    chunk["text"]
    for chunk in chunks
]

print(
    f"Loaded {len(texts)} chunks"
)

print(
    "Generating embeddings..."
)

embeddings = create_embeddings(
    texts
)

print(
    "Storing in ChromaDB..."
)

for index, chunk in enumerate(chunks):

    collection.add(
        ids=[str(index)],

        documents=[
            chunk["text"]
        ],

        embeddings=[
            embeddings[index]
        ],

        metadatas=[
            {
                "document":
                chunk.get(
                    "document",
                    "mars_report.pdf"
                ),

                "chunk_id":
                chunk["chunk_id"]
            }
        ]
    )

print(
    f"Stored {len(chunks)} chunks"
)