import { assert, describe, it } from "vitest";

import { solNumberToDecimal, decimalToSolNumber } from "../composables/token";

describe("Sol number to Decimal", () => {
  it("integer and decimal", () => {
    const result = solNumberToDecimal("1400000343", 6);
    assert.equal(result, "1400.000343");
  });

  it("only integer", () => {
    const result = solNumberToDecimal("14000000", 6);
    assert.equal(result, "14");
  });

  it("only decimal", () => {
    const result = solNumberToDecimal("14000000", 12);
    assert.equal(result, "0.000014");
  });
  it("decimals border case", () => {
    const result = solNumberToDecimal("140000", 6);
    assert.equal(result, "0.14");
  });
  it("decimals border case 2", () => {
    const result = solNumberToDecimal("140000", 5);
    assert.equal(result, "1.4");
  });
});

describe("Decimal to Sol number", () => {
  it("integer only", () => {
    const result = decimalToSolNumber("14", 6);
    assert.equal(result, "14000000");
  });
  it("decimal only", () => {
    const result = decimalToSolNumber("0.00414", 6);
    assert.equal(result, "4140");
  });
  it("decimal and integer", () => {
    const result = decimalToSolNumber("14.3509", 6);
    assert.equal(result, "14350900");
  });
  it("with comma", () => {
    const result = decimalToSolNumber("14,3509", 6);
    assert.equal(result, "14350900");
  });
  it("border", () => {
    const result = decimalToSolNumber("0.1", 6);
    assert.equal(result, "100000");
  });
  it("all zeros", () => {
    const result = decimalToSolNumber("0", 5);
    assert.equal(result, "0");
  });
  it("all zeros decimal", () => {
    const result = decimalToSolNumber("0.000", 12);
    assert.equal(result, "0");
  });
  it("trailing zeros", () => {
    const result = decimalToSolNumber("0.10000", 6);
    assert.equal(result, "100000");
  });
});
