import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/theme-toggle";

export function LegalFooter() {
  return <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-4 border-t border-border px-5 py-6 text-xs text-muted-foreground">
    <span>Punto</span><Link to="/terminos">Condiciones de uso</Link><Link to="/privacidad">Privacidad</Link><Link to="/cookies">Cookies</Link><ThemeToggle />
  </footer>;
}