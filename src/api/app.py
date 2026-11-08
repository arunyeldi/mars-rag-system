from fastapi import FastAPI

app = FastAPI(
    title="NASA Mars Mission RAG",
    version="1.0.0"
)

@app.get("/")
def health_check():

    return {
        "status": "healthy",
        "service": "NASA RAG"
    }