export const legalIdentityFields = [
  ["legal_operator", "Identidad legal del operador"],
  ["legal_nit", "NIT del operador"],
  ["legal_address", "Dirección para notificaciones"],
  ["legal_email", "Correo de privacidad y reclamos"],
] as const;

export const commercialFields = [
  ["usage_cost_notice", "Costos de uso, impuestos y cobros"],
  ["commercial_terms", "Condiciones comerciales: contratación, renovación, cancelación y reembolsos"],
] as const;

export function legalInformation(settings?: Record<string, string>) {
  const value = (key: string) => settings?.[key]?.trim() ?? "";
  return {
    operator: value("legal_operator"),
    nit: value("legal_nit"),
    address: value("legal_address"),
    email: value("legal_email"),
    costs: value("usage_cost_notice"),
    commercialTerms: value("commercial_terms"),
    missing: [...legalIdentityFields, ...commercialFields]
      .filter(([key]) => !value(key))
      .map(([, label]) => label),
  };
}