# NASA Mars Mission RAG System

## Overview

A production-grade Retrieval-Augmented Generation (RAG) system built to analyze NASA Mars mission reports.

## Objectives

- Semantic Search
- BM25 Search
- Hybrid Retrieval
- Cross Encoder Reranking
- Source Citations
- RAGAS Evaluation
- FastAPI Deployment

## Architecture

```text
NASA PDFs
    ↓
Ingestion
    ↓
Embedding Generation
    ↓
Vector Database
    ↓
Hybrid Retrieval
    ↓
Reranking
    ↓
LLM
    ↓
Answer + Citations
```

## Project Status

✅ Project Initialization

🚧 Data Ingestion Phase (In Progress)

## Tech Stack

- Python
- LlamaIndex
- ChromaDB / pgvector
- FastAPI
- RAGAS
- PostgreSQL

# Live Demo

https://nasa-rag-oc9g.onrender.com/docs
