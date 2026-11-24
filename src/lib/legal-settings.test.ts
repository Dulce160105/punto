import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { legalInformation } from "./legal-settings";

describe("Operator legal information", () => {
  test("missing identity and commercial data remain empty rather than invented", () => {
    const info = legalInformation({ legal_operator: "  " });
    assert.equal(info.operator, "");
    assert.equal(info.nit, "");
    assert.equal(info.address, "");
    assert.equal(info.email, "");
    assert.equal(info.costs, "");
    assert.equal(info.commercialTerms, "");
    assert.equal(info.missing.length, 6);
  });

  test("legal notices use exactly the operator identity and terms supplied by the administrator", () => {
    const info = legalInformation({
      legal_operator: " Operador de prueba ", legal_nit: "NIT de prueba",
      legal_address: "Dirección de prueba", legal_email: "legal@example.com",
      usage_cost_notice: "Precio de prueba", commercial_terms: "Condiciones de prueba",
    });
    assert.deepEqual(info, {
      operator: "Operador de prueba", nit: "NIT de prueba", address: "Dirección de prueba",
      email: "legal@example.com", costs: "Precio de prueba", commercialTerms: "Condiciones de prueba", missing: [],
    });
  });
});