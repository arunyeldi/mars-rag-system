class RAGException(Exception):
    """Base exception for RAG system."""
    pass


class RetrievalException(RAGException):
    """Raised when retrieval fails."""
    pass


class GenerationException(RAGException):
    """Raised when answer generation fails."""
    pass