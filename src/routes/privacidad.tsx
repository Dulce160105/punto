import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
export const Route = createFileRoute("/privacidad")({
  staticData: { sitemap: true },
  head: () => ({ meta: [{ title: "Política de privacidad — Punto" }, { name: "description", content: "Datos, finalidades, acceso y solicitudes de privacidad en Punto." }, { property: "og:title", content: "Política de privacidad — Punto" }, { property: "og:description", content: "Conoce cómo se usan los datos de tus tarjetas de lealtad." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <LegalPage kind="privacy" />,
});