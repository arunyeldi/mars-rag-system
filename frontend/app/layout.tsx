import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApolloX AI — Mission intelligence, retrieved.",
  description:
    "Explore a production-grade AI retrieval platform for NASA Mars mission reports, powered by hybrid search and grounded generation.",
  applicationName: "ApolloX AI Retrieval Platform",
  openGraph: {
    title: "ApolloX AI Retrieval Platform",
    description:
      "Mission intelligence, retrieved. Explore the architecture, ask the source documents, and inspect evaluation results.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans`}>{children}</body>
    </html>
  );
}
