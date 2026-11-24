import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { lovable } from "@/lib/pages-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SupportFab } from "@/components/support-fab";
import { useSettings } from "@/hooks/use-app-data";
import { useSession } from "@/hooks/use-session";
import { whatsappLink } from "@/lib/format";
import { CustomerMascot } from "@/components/customer-mascot";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Ingresar — Punto" },
      {
        name: "description",
        content: "Crea tu cuenta de empresa con Google o Apple y empieza tu programa de lealtad.",
      },
      { property: "og:title", content: "Ingresar — Punto" },
      { property: "og:description", content: "Accede con Google o Apple a tu panel de lealtad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { data: settings } = useSettings();
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/panel", replace: true });
  }, [user, navigate]);

  async function signIn(provider: "google" | "apple") {
    if (!accepted) {
      toast.error("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    setPending(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: new URL(import.meta.env.BASE_URL, window.location.origin).href,
    });
    if (result.error) {
      setPending(null);
      toast.error("No pudimos iniciar sesión. Intenta de nuevo.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/panel", replace: true });
  }

  const whatsapp = settings?.["support_whatsapp"];

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-6 sm:px-6">
      <div className="violet-stage relative w-full max-w-md overflow-hidden rounded-[2rem] border border-primary-foreground/20 p-6 shadow-2xl sm:p-8">
        <Link to="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground">
          ← Volver
        </Link>
        <div className="mx-auto mt-5 w-fit"><CustomerMascot seed="punto-acceso" size="lg" /></div>
        <h1 className="mt-4 text-center text-3xl font-bold">Ingresa a Punto</h1>
        <p className="mt-2 text-center text-sm text-primary-foreground/70">
          Usa tu cuenta de Google o Apple. No necesitas crear otra contraseña.
        </p>

        {settings?.["usage_cost_notice"] ? (
          <div className="mt-6 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 text-xs text-primary-foreground/70 backdrop-blur-xl">
            {settings["usage_cost_notice"]}
          </div>
        ) : null}

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-primary-foreground/75">
          <Checkbox
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
            className="mt-0.5"
          />
          <span>
            He leído y acepto los{" "}
            <Link to="/terminos" className="font-semibold text-primary-foreground underline-offset-4 hover:underline">
              términos y condiciones
            </Link>{" "}
            y he leído la <Link to="/privacidad" className="font-semibold underline">política de privacidad</Link>.
          </span>
        </label>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full bg-card text-foreground shadow-xl hover:bg-card/90"
            size="lg"
            disabled={pending !== null}
            onClick={() => signIn("google")}
          >
            {pending === "google" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continuar con Google
          </Button>
          <Button
            className="w-full border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            size="lg"
            variant="outline"
            disabled={pending !== null}
            onClick={() => signIn("apple")}
          >
            {pending === "apple" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continuar con Apple
          </Button>
        </div>

        {whatsapp ? (
          <p className="mt-6 text-center text-xs text-primary-foreground/65">
            ¿Necesitas ayuda?{" "}
            <a
              className="font-semibold text-primary-foreground underline-offset-4 hover:underline"
              href={whatsappLink(whatsapp, "Hola, necesito ayuda para registrarme en Punto.")}
              target="_blank"
              rel="noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        ) : null}
      </div>
      <SupportFab />
    </main>
  );
}
