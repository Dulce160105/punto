import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, QrCode, Sparkles, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportFab } from "@/components/support-fab";
import { useSettings } from "@/hooks/use-app-data";
import { useSession } from "@/hooks/use-session";
import { contactLink } from "@/lib/public-settings";
import { ThemeToggle } from "@/components/theme-toggle";
import { CustomerMascot } from "@/components/customer-mascot";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Punto — Tarjetas de lealtad digitales para tu negocio" },
      {
        name: "description",
        content:
          "Diseña tarjetas de lealtad digitales, suma puntos con códigos QR y administra a tus clientes desde el celular.",
      },
      { property: "og:title", content: "Punto — Tarjetas de lealtad digitales" },
      {
        property: "og:description",
        content: "Puntos, códigos QR y clientes en una sola app para tu negocio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    icon: Sparkles,
    title: "Diseña tu tarjeta",
    text: "Elige una plantilla, tus colores y cuántos puntos necesita tu premio.",
  },
  {
    icon: QrCode,
    title: "Comparte tus códigos QR",
    text: "Un código crea la tarjeta del cliente, el otro le suma un punto por visita.",
  },
  {
    icon: Users,
    title: "Fideliza y mide",
    text: "Mira tus clientes, sus puntos y los premios entregados en tiempo real.",
  },
];

function Index() {
  const { data: settings } = useSettings();
  const { user } = useSession();
  const [step, setStep] = useState(0);
  const whatsapp = contactLink(settings);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-14 px-4 pb-20 pt-4 sm:px-8 sm:pt-6">
      <header className="app-header sticky top-3 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-4 py-3 sm:px-5">
        <span className="text-lg font-bold">
          Punto<span className="text-primary">.</span>
        </span>
        <div className="flex items-center gap-1"><ThemeToggle /><Button asChild variant="ghost" size="sm">
          <Link to={user ? "/panel" : "/auth"}>{user ? "Mi panel" : "Ingresar"}</Link>
        </Button></div>
      </header>

      <section className="violet-stage relative grid min-h-[34rem] items-center overflow-hidden rounded-[2rem] p-7 shadow-2xl sm:p-12 lg:grid-cols-[minmax(0,1fr)_0.8fr]">
        <div className="relative z-10 max-w-xl space-y-7">
          <span className="inline-flex rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold">
            Punto · lealtad digital
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Una tarjeta que tus clientes sí quieren usar
          </h1>
          <p className="max-w-lg text-base text-primary-foreground/75 sm:text-lg">
            Tus clientes guardan su tarjeta en el celular y suman puntos escaneando un código QR. Tú
            decides cuántos puntos vale el premio y qué premio entregas.
          </p>
          <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="shadow-xl">
              <Link to={user ? "/panel" : "/auth"}>
                Crear mi tarjeta
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            {whatsapp ? (
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver costo de uso
                </a>
              </Button>
            ) : null}
          </div>
          <p className="flex items-center gap-2 text-xs text-primary-foreground/70">
            <Wallet className="h-4 w-4" />
            Se guarda en la pantalla de inicio del celular de tu cliente.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-10 lg:mt-0">
          <CustomerMascot seed="punto-principal" size="lg" active />
          <div className="absolute -bottom-8 left-1/2 w-64 -translate-x-1/2 rounded-full bg-primary-foreground/10 px-5 py-3 text-center text-sm backdrop-blur-xl">Cada visita cuenta</div>
        </div>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Cómo funciona</h2>
          <div className="flex gap-1.5">
            {steps.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setStep(index)}
                aria-label={`Paso ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === step ? "w-7 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const active = index === step;
            return (
              <button
                key={item.title}
                onClick={() => setStep(index)}
                className={`glass-soft p-5 text-left transition-all ${
                  active ? "glow-ring" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </button>
            );
          })}
        </div>
      </section>

      {settings?.["usage_cost_notice"] ? (
        <section className="glass-soft p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Aviso de costo de uso</p>
          <p className="mt-2">{settings["usage_cost_notice"]}</p>
        </section>
      ) : null}

      <SupportFab />
    </main>
  );
}
