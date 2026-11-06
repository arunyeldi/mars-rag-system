import json

from rank_bm25 import BM25Okapi


class BM25Retriever:

    def __init__(self):

        with open(
            "data/chunks/mars_chunks.json",
            encoding="utf-8"
        ) as f:

            self.chunks = json.load(f)

        self.tokenized_chunks = []

        for chunk in self.chunks:

            self.tokenized_chunks.append(
                chunk["text"].split()
            )

        self.bm25 = BM25Okapi(
            self.tokenized_chunks
        )

    def search(
        self,
        query,
        top_k=5
    ):

        scores = self.bm25.get_scores(
            query.split()
        )

        ranked = sorted(
            enumerate(scores),
            key=lambda x: x[1],
            reverse=True
        )

        results = []

        for idx, score in ranked[:top_k]:

            results.append(
                {
                    "score": float(score),
                    "chunk":
                    self.chunks[idx]
                }
            )

        return results