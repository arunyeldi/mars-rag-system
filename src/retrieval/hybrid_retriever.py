from src.retrieval.retriever import (
    retrieve_context
)

from src.retrieval.bm25_retriever import (
    BM25Retriever
)


class HybridRetriever:

    def __init__(self):

        self.bm25 = BM25Retriever()

    def search(
        self,
        query
    ):

        semantic = retrieve_context(
            query,
            top_k=3
        )

        bm25 = self.bm25.search(
            query,
            top_k=3
        )

        return {
            "semantic": semantic,
            "bm25": bm25
        }