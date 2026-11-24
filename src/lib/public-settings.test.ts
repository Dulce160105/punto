import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { contactLink, mascotIdentity, safeHttpsUrl } from "./public-settings";
describe("Image and contact links", () => {
  test("image links accept HTTPS and reject executable or insecure sources", () => {
    assert.equal(safeHttpsUrl("https://example.com/card.png"), "https://example.com/card.png");
    for (const url of ["javascript:alert(1)", "http://example.com/a.png", "https://user:pass@example.com/a.png"]) assert.equal(safeHttpsUrl(url), "");
  });
  test("administrator contact URL takes precedence over WhatsApp", () => {
    assert.equal(contactLink({ support_url: "https://example.com/contacto", support_whatsapp: "+502 1234 5678" }), "https://example.com/contacto");
    assert.ok(contactLink({ support_whatsapp: "+502 1234 5678" }).startsWith("https://wa.me/50212345678?"));
    assert.equal(contactLink({ support_whatsapp: "+50200000000" }), "");
  });
});
test("each card's mascot retains its own identity and color", () => {
  assert.deepEqual(mascotIdentity("card-a"), mascotIdentity("card-a"));
  assert.notEqual(mascotIdentity("card-a").hue, mascotIdentity("card-b").hue);
});