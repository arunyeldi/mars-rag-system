# ApolloX AI Retrieval Platform

A production-minded, source-grounded question-answering experience for NASA Mars mission reports. ApolloX combines a FastAPI retrieval backend with a responsive Next.js 15 interface.

## Product

- **Live query workspace** — Ask questions and see the answer, source chunks, and measured latency.
- **Hybrid retrieval** — Combines semantic retrieval with BM25 for conceptual and exact-term matches.
- **Grounded generation** — Uses Azure OpenAI and guardrails to keep answers tied to retrieved report context.
- **Evaluation dashboard** — Presents the reported RAGAS scores for answer relevancy, faithfulness, context precision, and context recall.
- **Traceable architecture** — Shows the document-to-answer pipeline and source attribution.

## Architecture

```text
NASA PDF reports
  → PDF ingestion and extraction
  → Context-aware chunking
  → Azure OpenAI embeddings
  → ChromaDB vector storage
  → Hybrid retrieval (semantic + BM25)
  → GPT-4o generation and guardrails
  → FastAPI POST /query
  → Answer, source citations, and latency
```

## Repository structure

```text
.
├── frontend/
│   ├── app/                 # Next.js App Router, metadata, global styles
│   ├── components/          # ApolloX experience, ShadCN button, and workspace
│   ├── .env.example         # Frontend environment variable template
│   ├── package.json
│   └── ...                  # Next.js, TypeScript, Tailwind configuration
├── src/
│   ├── api/                 # FastAPI app, query contract, and service
│   ├── evaluation/          # RAGAS evaluation and reports
│   ├── generation/          # Answer generation, citations, guardrails
│   ├── ingestion/           # PDF processing, chunking, and embeddings
│   ├── retrieval/           # Hybrid search and reranking
│   └── storage/             # ChromaDB integration
├── tests/                   # Backend tests
└── docs/                    # Architecture and evaluation notes
```

## Run the frontend locally

Requirements: Node.js 20.19+, 22.13+, or 24+ and npm.

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
```

Set `API_BASE_URL` in `frontend/.env.local` to the base URL of the FastAPI service (no `/query` suffix), then start the app:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Queries go through the Next.js `/api/query` route, which calls FastAPI server-to-server; browser CORS configuration is not required.

## Frontend environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `API_BASE_URL` | Yes | Server-only base URL of the FastAPI deployment, for example `https://nasa-rag-oc9g.onrender.com`. The Next.js `/api/query` route sends `POST {base}/query`. |
| `NEXT_PUBLIC_GITHUB_URL` | No | Repository URL; defaults to this repository. |
| `NEXT_PUBLIC_LINKEDIN_URL` | No | Public LinkedIn profile URL shown in the footer. |
| `NEXT_PUBLIC_RESUME_URL` | No | Public resume URL shown in the footer. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact email shown in the footer. |

`API_BASE_URL` is used only by the Next.js server and is not exposed in the browser bundle. Do not put API keys or credentials in `NEXT_PUBLIC_` variables.

## Deploy the frontend to Vercel

1. Push the repository to GitHub and import it into [Vercel](https://vercel.com/new).
2. Set **Root Directory** to `frontend`. Vercel will detect Next.js and use the included build configuration.
3. Add `API_BASE_URL` in **Project → Settings → Environment Variables**. Use the deployed FastAPI base URL without `/query`.
4. Optionally add the GitHub, LinkedIn, resume, and contact variables above.
5. Deploy. The server-side proxy avoids cross-origin browser requests, so frontend origins do not need to be added to the backend CORS allowlist for queries.

### Backend CORS (optional)

The frontend proxy does not require CORS configuration. If other browser-based clients should call FastAPI directly, set `FRONTEND_ORIGINS` on the FastAPI host to a comma-separated allowlist of complete origins:

```text
FRONTEND_ORIGINS=https://your-project.vercel.app,https://your-custom-domain.com,http://localhost:3000
```

The backend defaults to `http://localhost:3000` for local development. Keep the production allowlist restricted to the frontend origins you control.

## API contract

Request:

```json
{ "question": "What were the primary goals of the Mars Exploration Program?" }
```

Response:

```json
{
  "answer": "The answer grounded in the report...",
  "sources": ["- Mars Report (Chunk 15)", "- Mars Report (Chunk 18)"],
  "latency": 1.23
}
```

The frontend validates the response, presents errors without exposing secrets, and shows the returned citations and latency with the answer.

## Backend

The existing FastAPI service is configured with the `AZURE_OPENAI_*` environment variables documented by `src/config.py`. Start it locally with:

```powershell
uvicorn src.api.app:app --reload
```

Run backend tests with:

```powershell
pytest
```
