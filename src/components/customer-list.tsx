import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerMascot } from "@/components/customer-mascot";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Card = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  points: number;
  rewards_redeemed: number;
  last_scan_at: string | null;
  created_at: string;
};

function fmt(date: string | null) {
  return date ? new Date(date).toLocaleDateString("es-GT") : "—";
}

export function CustomerList({ businessId, pointsRequired }: { businessId: string; pointsRequired: number }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const key = ["cards", businessId];

  const { data: cards = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_cards")
        .select("id, customer_name, customer_email, customer_phone, points, rewards_redeemed, last_scan_at, created_at")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Card[];
    },
  });

  const action = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: "reset" | "delete" }) => {
      const { error: scanError } = await supabase.from("point_scans").delete().eq("card_id", id);
      if (scanError) throw scanError;
      const { error } =
        type === "delete"
          ? await supabase.from("loyalty_cards").delete().eq("id", id)
          : await supabase
              .from("loyalty_cards")
              .update({ points: 0, rewards_redeemed: 0, last_scan_at: null })
              .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      toast.success(v.type === "delete" ? "Tarjeta eliminada" : "Tarjeta reiniciada");
      queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const q = search.trim().toLowerCase();
  const filtered = cards.filter((c) =>
    [c.customer_name, c.customer_email, c.customer_phone].some((v) => v?.toLowerCase().includes(q)),
  );

  return (
    <section className="surface-panel mt-6 space-y-5 p-5 sm:p-7">
      <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="eyebrow">Tu comunidad</p>
          <h2 className="truncate text-xl font-bold">Clientes con tarjeta ({cards.length})</h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay clientes con tarjeta.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => (
            <div key={c.id} className="customer-card group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-4">
              <CustomerMascot seed={c.id} size="md" active={c.points >= pointsRequired} />
              <div className="min-w-0 space-y-1 text-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="truncate font-bold">{c.customer_name}</p>
                  <span className="points-pill">{c.points}/{pointsRequired}</span>
                </div>
                <p className="break-words text-muted-foreground">
                  {c.customer_email || "Sin correo"} · {c.customer_phone || "Sin teléfono"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.rewards_redeemed} premios · último punto {fmt(c.last_scan_at)} · desde {fmt(c.created_at)}
                </p>
                <div className="mt-3 flex gap-2">
                <Confirm
                  title="¿Reiniciar tarjeta?"
                  text={`Los puntos y premios de ${c.customer_name} volverán a cero.`}
                  label="Reiniciar"
                  onConfirm={() => action.mutate({ id: c.id, type: "reset" })}
                  trigger={<Button size="icon" variant="outline" aria-label="Reiniciar tarjeta" title="Reiniciar tarjeta"><RotateCcw /></Button>}
                />
                <Confirm
                  title="¿Eliminar tarjeta?"
                  text={`Se borrará la tarjeta de ${c.customer_name} y todo su historial. No se puede deshacer.`}
                  label="Eliminar"
                  onConfirm={() => action.mutate({ id: c.id, type: "delete" })}
                  trigger={<Button size="icon" variant="destructive" aria-label="Eliminar tarjeta" title="Eliminar tarjeta"><Trash2 /></Button>}
                />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Confirm(props: { title: string; text: string; label: string; onConfirm: () => void; trigger: React.ReactNode }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>{props.label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
