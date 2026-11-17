"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  FileText,
  Github,
  Layers3,
  Linkedin,
  LoaderCircle,
  Mail,
  Menu,
  Network,
  Orbit,
  Radar,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type QueryResult = {
  answer: string;
  sources: string[];
  latency: number;
};

type QueryError = {
  title: string;
  detail: string;
};

const metrics = [
  { label: "Faithfulness", value: 98.46, color: "#ff6037", caption: "grounded in source context" },
  { label: "Context recall", value: 100, color: "#a5a1ff", caption: "relevant context retrieved" },
  { label: "Context precision", value: 93.53, color: "#62d7c6", caption: "signal over noise" },
  { label: "Answer relevancy", value: 82.42, color: "#f5c46b", caption: "answers stay on question" },
];

const architecture = [
  { name: "PDF ingestion", detail: "NASA mission reports", icon: FileText, color: "orange" },
  { name: "Chunking", detail: "Context-aware splits", icon: Layers3, color: "violet" },
  { name: "Azure OpenAI", detail: "Text embeddings", icon: Orbit, color: "blue" },
  { name: "Vector store", detail: "ChromaDB", icon: Database, color: "teal" },
  { name: "Hybrid retrieval", detail: "Semantic + BM25", icon: Radar, color: "orange" },
  { name: "Generation", detail: "GPT-4o + guardrails", icon: Sparkles, color: "violet" },
  { name: "FastAPI", detail: "Typed query endpoint", icon: Workflow, color: "blue" },
  { name: "API response", detail: "Answer + citations", icon: ArrowRight, color: "teal" },
];

const engineering = [
  {
    title: "Hybrid retrieval",
    description: "Pairs semantic similarity with BM25 keyword search to surface both conceptual answers and exact mission terminology.",
    icon: Network,
    tag: "RETRIEVAL",
  },
  {
    title: "Azure OpenAI",
    description: "Uses dedicated embedding and chat deployments to power vector search and grounded answer generation.",
    icon: Sparkles,
    tag: "GENERATION",
  },
  {
    title: "ChromaDB",
    description: "Stores embedded report chunks alongside document metadata for traceable, source-aware retrieval.",
    icon: Database,
    tag: "STORAGE",
  },
  {
    title: "RAGAS evaluation",
    description: "Measures answer relevancy, faithfulness, context precision, and context recall against a golden dataset.",
    icon: BarChart3,
    tag: "EVALUATION",
  },
  {
    title: "Guardrails",
    description: "Checks retrieved context before generation and avoids presenting unsupported information as fact.",
    icon: ShieldCheck,
    tag: "RELIABILITY",
  },
  {
    title: "Observability",
    description: "Captures query, retrieval, generation, and latency details to help diagnose the end-to-end pipeline.",
    icon: Radar,
    tag: "OPERATIONS",
  },
  {
    title: "FastAPI",
    description: "Serves a typed request and response contract with source citations and measured pipeline latency.",
    icon: Zap,
    tag: "API",
  },
  {
    title: "Automated testing",
    description: "Exercises API behavior, retrieval, configuration, and guardrails as the system evolves.",
    icon: Check,
    tag: "QUALITY",
  },
];

const suggestions = [
  "What were the primary goals of the Mars Exploration Program?",
  "How does the rover search for evidence of past water?",
  "What are the biggest challenges of landing on Mars?",
];

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

function MetricGauge({ label, value, color, caption }: (typeof metrics)[number]) {
  return (
    <motion.article
      variants={reveal}
      className="group rounded-2xl border border-white/[0.08] bg-[#111827]/75 p-5 transition-colors hover:border-white/[0.16] sm:p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      </div>
      <div className="relative mx-auto mt-3 h-36 w-36" role="img" aria-label={`${label}: ${value}%`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={[{ value, fill: color }]}
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={9}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" background={{ fill: "rgba(148,163,184,0.12)" }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[1.65rem] font-semibold tracking-[-0.06em] text-white">{value}%</span>
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.17em] text-slate-500">score</span>
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-slate-500">{caption}</p>
    </motion.article>
  );
}

function formatAnswer(answer: string) {
  return answer
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function getErrorMessage(response: Response) {
  if (response.status === 429) return "The service is receiving a lot of questions. Please try again in a moment.";
  if (response.status >= 500) return "The retrieval service is temporarily unavailable. Please try again shortly.";
  return "We couldn’t process that question. Please check it and try again.";
}

export function ApolloXExperience() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function submitQuery(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanedQuestion = question.trim();
    if (!cleanedQuestion || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: cleanedQuestion }),
        signal: AbortSignal.timeout(45_000),
      });

      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(getErrorMessage(response));
      }

      if (!body || typeof body !== "object" || !("answer" in body) || typeof body.answer !== "string") {
        throw new Error("The retrieval service returned an unexpected response. Please try again.");
      }

      const payload = body as { answer: string; sources?: unknown; latency?: unknown };
      setResult({
        answer: payload.answer,
        sources: Array.isArray(payload.sources)
          ? payload.sources.filter((source): source is string => typeof source === "string")
          : [],
        latency: typeof payload.latency === "number" && Number.isFinite(payload.latency) ? payload.latency : 0,
      });
    } catch (caught) {
      const detail =
        caught instanceof Error && caught.name === "TimeoutError"
          ? "This question is taking longer than expected. Please try again."
          : caught instanceof TypeError
            ? "We couldn’t reach the application server. Check your connection and try again."
            : caught instanceof Error
              ? caught.message
              : "Something unexpected happened. Please try again.";
      setError({ title: "We couldn’t complete that request", detail });
    } finally {
      setLoading(false);
    }
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void submitQuery();
    }
  }

  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/arunyeldi/mars-rag-system";
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <main className="overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[52rem] overflow-hidden" aria-hidden="true">
        <div className="grid-background absolute inset-0" />
        <div className="absolute -left-40 -top-56 size-[38rem] rounded-full bg-accent/[0.11] blur-[120px]" />
        <div className="absolute right-[-12rem] top-12 size-[34rem] rounded-full bg-indigo-600/[0.12] blur-[140px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0b1020]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
          <a href="#home" className="flex items-center gap-2.5" aria-label="ApolloX home">
            <span className="flex size-8 items-center justify-center rounded-[10px] bg-accent text-white shadow-[0_5px_22px_rgba(255,59,0,0.3)]">
              <Orbit size={18} strokeWidth={2.2} />
            </span>
            <span className="text-[15px] font-semibold tracking-[-0.04em] text-white">apollo<span className="text-accent">x</span></span>
            <span className="ml-1 hidden rounded-md border border-white/[0.09] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500 sm:inline">AI LAB</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a className="text-[13px] text-slate-400 transition hover:text-white" href="#architecture">Architecture</a>
            <a className="text-[13px] text-slate-400 transition hover:text-white" href="#evaluation">Evaluation</a>
            <a className="text-[13px] text-slate-400 transition hover:text-white" href="#engineering">Engineering</a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-slate-300 transition hover:text-white"
            >
              <Github size={15} /> Source
            </a>
            <a
              href="#workspace"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-[12px] font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Open workspace <ArrowUpRight size={14} />
            </a>
          </div>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.07] bg-[#0b1020] px-5 py-3 md:hidden">
            {[
              ["Architecture", "#architecture"],
              ["Evaluation", "#evaluation"],
              ["Engineering", "#engineering"],
              ["Open workspace", "#workspace"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-white/[0.06] py-3 text-sm text-slate-300 last:border-0"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section id="home" className="relative mx-auto max-w-7xl px-5 pb-20 pt-[5.5rem] sm:px-8 sm:pt-28 lg:pb-24 lg:pt-36">
        <div className="relative z-10 max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={reveal}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-orange-200">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-300 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-orange-400" />
              </span>
              Mission intelligence · RAG system
            </div>
            <h1 className="max-w-4xl text-[2.9rem] font-semibold leading-[1.04] tracking-[-0.072em] text-white sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              ApolloX AI
              <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">Retrieval Platform</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Production-grade AI retrieval for the next frontier. Grounded answers from NASA Mars mission reports, powered by hybrid search and measured at every step.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#workspace"
                className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(255,59,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ff5120]"
              >
                Try live demo <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#architecture"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.025] px-5 text-sm font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                Explore architecture <ArrowDown size={15} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 16 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="pointer-events-none absolute right-[-10rem] top-12 hidden h-[26rem] w-[38rem] items-center justify-center lg:flex"
          aria-hidden="true"
        >
          <div className="absolute size-[25rem] rounded-full border border-white/[0.06]" />
          <div className="absolute size-[19rem] rounded-full border border-white/[0.08]" />
          <div className="absolute size-[13rem] rounded-full border border-dashed border-orange-300/20" />
          <div className="absolute size-72 rounded-full bg-gradient-to-br from-orange-500/[0.18] via-violet-500/[0.1] to-transparent blur-3xl" />
          <div className="relative flex size-28 items-center justify-center rounded-[2rem] border border-orange-300/20 bg-[#12172a]/90 shadow-[0_0_80px_rgba(255,59,0,0.15)]">
            <Orbit size={50} strokeWidth={1.15} className="text-orange-300" />
          </div>
          <div className="glass absolute right-24 top-14 rounded-xl px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-[11px] text-slate-300"><span className="size-1.5 rounded-full bg-emerald-400" /> grounded generation</span>
          </div>
          <div className="glass absolute bottom-14 left-16 rounded-xl px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-[11px] text-slate-300"><Search size={12} className="text-indigo-300" /> hybrid retrieval</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
          className="relative z-10 mt-16 grid grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-4 lg:mt-24"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="rounded-2xl border border-white/[0.085] bg-[#111827]/70 p-4 backdrop-blur-sm sm:p-5">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: metric.color }} aria-hidden="true" />
                <p className="text-[11px] text-slate-500 sm:text-xs">{metric.label}</p>
              </div>
              <p className="mt-3 text-[1.8rem] font-semibold tracking-[-0.065em] text-white sm:text-[2rem]">
                {index === 1 ? "100" : metric.value.toFixed(2)}<span className="ml-0.5 text-sm font-medium text-slate-500">%</span>
              </p>
              <p className="mt-1 text-[10px] text-slate-600 sm:text-[11px]">{metric.caption}</p>
            </div>
          ))}
        </motion.div>
        <p className="mt-4 text-[10px] text-slate-600">RAGAS evaluation · NASA Mars report dataset</p>
      </section>

      <section id="architecture" className="scroll-mt-20 border-y border-white/[0.06] bg-[#0f1422]/70">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">01 — System design</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-4xl">From source to signal.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">A traceable retrieval pipeline, built to turn technical mission documents into clear, source-backed answers.</p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {architecture.map((step, index) => (
              <motion.div
                key={step.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={reveal}
                transition={{ delay: index * 0.06 }}
                className="group relative"
              >
                <div className="flex h-full min-h-[130px] items-start gap-4 rounded-2xl border border-white/[0.075] bg-[#111827]/65 p-5 transition hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-[#141c2c]">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                    step.color === "orange" ? "border-orange-400/20 bg-orange-400/[0.08] text-orange-300" :
                    step.color === "violet" ? "border-violet-400/20 bg-violet-400/[0.08] text-violet-300" :
                    step.color === "teal" ? "border-teal-400/20 bg-teal-400/[0.08] text-teal-300" :
                    "border-blue-400/20 bg-blue-400/[0.08] text-blue-300"
                  }`}>
                    <step.icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="pt-0.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-slate-600">STEP 0{index + 1}</div>
                    <h3 className="mt-1.5 text-sm font-semibold text-slate-100">{step.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{step.detail}</p>
                  </div>
                  <ChevronRight className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-slate-700 lg:block" size={14} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
            <span className="h-px w-8 bg-orange-500/40" />
            Every answer traces back to its source chunks
          </div>
        </div>
      </section>

      <section id="workspace" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">02 — Live retrieval</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-4xl">Ask the mission.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Ask a question about Mars exploration. ApolloX searches mission reports, then returns an answer alongside the source chunks that informed it.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300"><CircleHelp size={17} /></span>
              <p className="text-xs leading-5 text-slate-500">Answers are generated from retrieved context. If the reports don’t contain enough evidence, the platform will say so.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.55 }}>
            <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#111827]/90 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-violet-500/20 text-orange-300"><Sparkles size={17} /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Mission research</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">NASA Mars report · source grounded</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> API ready
                </span>
              </div>

              <div className="min-h-[255px] px-5 py-6 sm:min-h-[292px] sm:px-6">
                {!result && !error && !loading && (
                  <div className="flex min-h-[210px] flex-col justify-center">
                    <div className="mb-5 flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400"><Search size={18} /></div>
                    <p className="text-sm font-medium text-slate-200">Your research starts here.</p>
                    <p className="mt-1 text-xs text-slate-500">Choose a suggested question or ask your own.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setQuestion(suggestion)}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-left text-[11px] leading-4 text-slate-400 transition hover:border-orange-300/25 hover:text-slate-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex min-h-[230px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
                    <div className="relative flex size-12 items-center justify-center">
                      <span className="absolute inset-0 animate-ping rounded-full bg-orange-500/15" />
                      <span className="relative flex size-10 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-400/[0.08] text-orange-300"><LoaderCircle size={19} className="animate-spin" /></span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-200">Searching mission archives</p>
                    <p className="mt-1 text-xs text-slate-500">Retrieving evidence and grounding your answer…</p>
                    <div className="mt-5 flex gap-1">
                      {[0, 1, 2].map((dot) => <span key={dot} className="size-1 rounded-full bg-orange-400/60" style={{ animation: `pulse 1s ${dot * 0.18}s infinite` }} />)}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex min-h-[220px] flex-col justify-center" role="alert">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-rose-400/20 bg-rose-400/[0.08] text-rose-300"><CircleHelp size={17} /></div>
                    <p className="mt-4 text-sm font-semibold text-slate-100">{error.title}</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">{error.detail}</p>
                  </div>
                )}

                {result && (
                  <div aria-live="polite">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-300">Answer</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500"><Clock3 size={12} /> {result.latency.toFixed(2)}s</span>
                    </div>
                    <div className="prose-answer mt-3 text-[13px] leading-6 text-slate-300">
                      {formatAnswer(result.answer).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}
                    </div>
                    {result.sources.length > 0 && (
                      <div className="mt-6 border-t border-white/[0.07] pt-4">
                        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Sources · {result.sources.length}</p>
                        <div className="flex flex-wrap gap-2">
                          {result.sources.map((source, index) => (
                            <span key={`${source}-${index}`} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300/15 bg-indigo-300/[0.055] px-2.5 py-1.5 text-[11px] text-indigo-200">
                              <FileText size={12} className="text-indigo-300/70" /> {source.replace(/^-+\s*/, "")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={submitQuery} className="border-t border-white/[0.07] bg-[#0e1422]/70 p-4 sm:p-5">
                <label htmlFor="question" className="sr-only">Ask a question about the NASA Mars mission</label>
                <div className="flex items-end gap-3 rounded-xl border border-white/[0.1] bg-[#0b1020]/85 p-2 pl-3 transition focus-within:border-orange-400/40">
                  <textarea
                    id="question"
                    rows={2}
                    maxLength={1200}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={onComposerKeyDown}
                    placeholder="Ask a question about the NASA Mars mission..."
                    className="max-h-36 min-h-[48px] flex-1 resize-y bg-transparent py-2 text-sm leading-5 text-white placeholder:text-slate-600 focus:outline-none"
                    aria-describedby="composer-hint"
                  />
                  <Button
                    type="submit"
                    disabled={!question.trim() || loading}
                    size="icon"
                    className="shrink-0 rounded-lg disabled:bg-slate-700 disabled:text-slate-500"
                    aria-label="Send question"
                  >
                    {loading ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between px-1">
                  <p id="composer-hint" className="text-[10px] text-slate-600">Enter to send · ⌘/Ctrl + Enter</p>
                  <span className="text-[10px] text-slate-600">{question.length}/1,200</span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="evaluation" className="scroll-mt-20 border-y border-white/[0.06] bg-[#0f1422]/70">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">03 — Evaluation</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-white sm:text-4xl">Evidence, not vibes.</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500"><BarChart3 size={15} className="text-indigo-300" /> RAGAS · golden dataset evaluation</div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => <MetricGauge key={metric.label} {...metric} />)}
          </motion.div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[11px] text-slate-500">
            <span>Evaluation snapshot · Reported RAGAS scores</span>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-slate-400 transition hover:text-white">
              Explore evaluation code <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </section>

      <section id="engineering" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300">04 — Engineering principles</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-semibold tracking-[-0.055em] text-white sm:text-4xl">Built for trust at every layer.</h2>
            <p className="max-w-sm text-sm leading-6 text-slate-500">Production-minded components for quality, transparency, and dependable retrieval.</p>
          </div>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {engineering.map((item, index) => (
            <motion.article
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={reveal}
              transition={{ delay: (index % 4) * 0.05 }}
              className="group rounded-2xl border border-white/[0.075] bg-[#111827]/50 p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#111827]"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition group-hover:border-orange-300/20 group-hover:text-orange-200">
                  <item.icon size={17} strokeWidth={1.8} />
                </span>
                <span className="font-mono text-[9px] tracking-[0.12em] text-slate-600">{item.tag}</span>
              </div>
              <h3 className="mt-5 text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <footer id="contact" className="border-t border-white/[0.07] bg-[#080c16]">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-white/[0.07] text-orange-300"><Orbit size={17} /></span>
              <div>
                <p className="text-sm font-semibold tracking-[-0.03em] text-slate-200">ApolloX AI Retrieval Platform</p>
                <p className="mt-1 text-[10px] text-slate-600">A mission intelligence project · Built with care</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"><Github size={14} /> GitHub</a>
              {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"><Linkedin size={14} /> LinkedIn</a>}
              {resumeUrl && <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"><FileText size={14} /> Resume</a>}
              {contactEmail && <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-white"><Mail size={14} /> Email</a>}
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} ApolloX AI · Built for the curious.</span>
            <span className="inline-flex items-center gap-1.5">Answers grounded in source documents <Check size={11} className="text-emerald-500/70" /></span>
          </div>
        </div>
      </footer>
    </main>
  );
}
