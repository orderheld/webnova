import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/content/types";
import { findRoute, isLocale, routes } from "@/lib/routes";
import { renderPage, pageMeta } from "@/views";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    routes.filter((r) => r.paths[lang]).map((r) => ({ lang, path: r.paths[lang].split("/") })),
  );
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[...path]">): Promise<Metadata> {
  const { lang, path } = await params;
  if (!isLocale(lang)) return {};
  const entry = findRoute(lang, path.join("/"));
  if (!entry) return {};
  return pageMeta(lang, entry);
}

export default async function Page({ params }: PageProps<"/[lang]/[...path]">) {
  const { lang, path } = await params;
  if (!isLocale(lang)) notFound();
  const entry = findRoute(lang, path.join("/"));
  if (!entry || entry.kind === "home") notFound();
  return renderPage(lang, entry);
}
