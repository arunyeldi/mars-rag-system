# Architecture Decisions

## Why NASA Reports?

NASA publishes high-quality technical documents that are ideal for demonstrating RAG capabilities.

## Why Hybrid Retrieval?

Technical acronyms and specific terminology are often missed by embeddings alone.

Combining:

- Semantic Search
- BM25 Search

improves retrieval quality.

## Why Reranking?

Retrieval returns candidate chunks.

Reranking helps select the most relevant chunks before generation.