import { z } from "zod";

export function safeHttpsUrl(value: string): string {
  const parsed = z.string().trim().url().max(2048).safeParse(value);
  if (!parsed.success) return "";
  const url = new URL(parsed.data);
  if (url.protocol !== "https:" || url.username || url.password) return "";
  return url.href;
}

export function contactLink(settings?: Record<string, string>): string {
  const link = safeHttpsUrl(settings?.["support_url"] ?? "");
  if (link) return link;
  const phone = (settings?.["support_whatsapp"] ?? "").replace(/[\s()+-]/g, "");
  return /^\d{8,15}$/.test(phone) && !/^5020+$/.test(phone) ? `https://wa.me/${phone}?text=${encodeURIComponent("Hola, me interesa Punto para mi negocio.")}` : "";
}

export function mascotIdentity(seed: string) {
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return { hue: hash % 360, shape: hash % 3, delay: -(hash % 3400) / 1000 };
}