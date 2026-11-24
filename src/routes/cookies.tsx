import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
export const Route = createFileRoute("/cookies")({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title: "Cookies y almacenamiento — Punto" }, { name: "description", content: "Aviso del almacenamiento necesario para sesiones, tarjetas y preferencias en Punto." }, { property: "og:title", content: "Cookies y almacenamiento — Punto" }, { property: "og:description", content: "Tus opciones sobre cookies y almacenamiento del navegador." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <LegalPage kind="cookies" />,
});