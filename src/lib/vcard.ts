type BusinessContact = {
  commercial_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
};

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function openBusinessContact(business: BusinessContact) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(business.commercial_name)}`,
    `ORG:${escapeVCard(business.commercial_name)}`,
    business.phone ? `TEL;TYPE=WORK,VOICE:${escapeVCard(business.phone)}` : null,
    business.email ? `EMAIL;TYPE=WORK:${escapeVCard(business.email)}` : null,
    business.website ? `URL:${escapeVCard(business.website)}` : null,
    business.address ? `ADR;TYPE=WORK:;;${escapeVCard(business.address)};;;;` : null,
    "END:VCARD",
  ].filter(Boolean);
  const blob = new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${business.commercial_name.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+/g, "-") || "empresa"}.vcf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}