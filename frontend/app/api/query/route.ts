import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const QUESTION_LIMIT = 1200;

type UpstreamResponse = {
  answer: string;
  sources: string[];
  latency: number;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ detail: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("question" in body) ||
    typeof body.question !== "string"
  ) {
    return errorResponse("A question is required.", 400);
  }

  const question = body.question.trim();
  if (!question || question.length > QUESTION_LIMIT) {
    return errorResponse(
      `Question must be between 1 and ${QUESTION_LIMIT} characters.`,
      400,
    );
  }

  const apiBase = (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  )
    .trim()
    .replace(/\/+$/, "");

  if (!apiBase) {
    console.error("API_BASE_URL is not configured for the query proxy.");
    return errorResponse("The retrieval service is not configured.", 503);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ question }),
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return errorResponse(
        "The retrieval service took too long to respond. Please try again.",
        504,
      );
    }

    console.error("Could not reach the configured retrieval service.", error);
    return errorResponse(
      "The retrieval service is temporarily unreachable. Please try again.",
      502,
    );
  }

  let responseBody: unknown;
  try {
    responseBody = await upstream.json();
  } catch {
    console.error(`Retrieval service returned non-JSON (HTTP ${upstream.status}).`);
    return errorResponse(
      "The retrieval service returned an invalid response.",
      502,
    );
  }

  if (!upstream.ok) {
    console.error(`Retrieval service returned HTTP ${upstream.status}.`);
    return errorResponse(
      upstream.status >= 500
        ? "The retrieval service encountered an error. Please try again shortly."
        : "The retrieval service could not process that question.",
      upstream.status >= 500 ? 502 : upstream.status,
    );
  }

  if (
    !responseBody ||
    typeof responseBody !== "object" ||
    !("answer" in responseBody) ||
    typeof responseBody.answer !== "string" ||
    !("sources" in responseBody) ||
    !Array.isArray(responseBody.sources) ||
    !responseBody.sources.every((source) => typeof source === "string") ||
    !("latency" in responseBody) ||
    typeof responseBody.latency !== "number" ||
    !Number.isFinite(responseBody.latency)
  ) {
    console.error("Retrieval service returned a response that does not match its contract.");
    return errorResponse(
      "The retrieval service returned an invalid response.",
      502,
    );
  }

  const result: UpstreamResponse = {
    answer: responseBody.answer,
    sources: responseBody.sources,
    latency: responseBody.latency,
  };

  return NextResponse.json(result);
}
