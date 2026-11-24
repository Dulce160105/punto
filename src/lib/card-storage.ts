const PREFIX = "punto_card_";

export function saveCard(businessId: string, cardId: string) {
  try {
    localStorage.setItem(PREFIX + businessId, cardId);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function getCard(businessId: string) {
  try {
    return localStorage.getItem(PREFIX + businessId);
  } catch {
    return null;
  }
}

export function allCards(): string[] {
  const ids: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) {
        const v = localStorage.getItem(key);
        if (v) ids.push(v);
      }
    }
  } catch {
    /* nada */
  }
  return ids;
}
