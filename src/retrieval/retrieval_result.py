from dataclasses import dataclass

@dataclass
class RetrievedChunk:
    text: str
    document: str
    chunk_id: int