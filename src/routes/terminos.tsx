import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terminos")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Términos y condiciones — Punto" },
      {
        name: "description",
        content: "Términos, condiciones y política de privacidad del programa de lealtad Punto.",
      },
      { property: "og:title", content: "Términos y condiciones — Punto" },
      { property: "og:description", content: "Condiciones de uso y privacidad de Punto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return <LegalPage kind="terms" />;
}
