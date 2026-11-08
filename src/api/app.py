from fastapi import FastAPI

from src.api.models import (
    QueryRequest,
    QueryResponse
)

from src.api.services import (
    run_rag_pipeline
)

app = FastAPI(
    title="NASA Mars Mission RAG API",
    description="""
    Production-grade RAG system for
    NASA Mars mission reports.

    Features:
    - Hybrid Retrieval
    - Azure OpenAI Embeddings
    - ChromaDB
    - RAGAS Evaluation
    - Source Citations
    """,
    version="1.0.0"
)

@app.get("/")
def health_check():

    return {
        "status": "healthy",
        "service": "NASA RAG"
    }


@app.post(
    "/query",
    response_model=QueryResponse
)
def query_documents(
    request: QueryRequest
):

    result = run_rag_pipeline(
        request.question
    )

    return QueryResponse(
        answer=result["answer"],
        sources=result["sources"]
    )
