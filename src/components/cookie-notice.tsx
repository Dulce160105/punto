import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(localStorage.getItem("punto_storage_notice") !== "seen"); }, []);
  if (!visible) return null;
  return <aside aria-label="Aviso de cookies" className="fixed bottom-4 left-4 right-20 z-50 max-w-lg rounded-lg border border-border bg-card p-4 text-sm text-card-foreground shadow-lg">
    <p>Usamos almacenamiento necesario para iniciar sesión, recordar tus tarjetas y tu tema. No activamos publicidad ni analítica opcional.</p>
    <div className="mt-3 flex items-center justify-between gap-3"><Link to="/cookies" className="text-primary underline">Ver aviso</Link><Button size="sm" onClick={() => { localStorage.setItem("punto_storage_notice", "seen"); setVisible(false); }}>Entendido</Button></div>
  </aside>;
}