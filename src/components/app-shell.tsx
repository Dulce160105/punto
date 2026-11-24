import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SupportFab } from "@/components/support-fab";
import { useIsAdmin } from "@/hooks/use-app-data";
import { useSession } from "@/hooks/use-session";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { data: isAdmin } = useIsAdmin(user?.id);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="app-header sticky top-0 z-40 mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:px-8">
        <Link to="/panel" className="text-lg font-bold">
          Punto<span className="text-primary">.</span>
        </Link>
        <nav className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" title="Mi empresa">
            <Link to="/panel"><Building2 /><span className="hidden sm:inline">Mi empresa</span></Link>
          </Button>
          {isAdmin ? (
            <Button asChild variant="ghost" size="sm" title="Administración">
              <Link to="/admin"><LayoutDashboard /><span className="hidden sm:inline">Administración</span></Link>
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={signOut} aria-label="Salir">
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-7 sm:px-8 sm:pt-10">{children}</main>
      <SupportFab />
    </div>
  );
}
