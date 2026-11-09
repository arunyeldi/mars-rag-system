from fastapi import FastAPI
from fastapi import HTTPException

from src.config import (
    validate_config
)

from src.api.exceptions import (
    RAGException
)


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

validate_config()


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "configuration": "valid"
    }


@app.post(
    "/query",
    response_model=QueryResponse
)
def query_documents(
    request: QueryRequest
):

    try:

        result = run_rag_pipeline(
            request.question
        )

        return QueryResponse(
            answer=result["answer"],
            sources=result["sources"],
            latency=result["latency"]
        )

    except RAGException as ex:

        raise HTTPException(
            status_code=500,
            detail=str(ex)
        )
