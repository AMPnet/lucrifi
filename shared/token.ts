function solNumberToDecimal(amount: string, decimals: number): string {
  const integer = amount.slice(0, -decimals);
  let decimal = amount.slice(-decimals);

  // Remove trailing zeros
  decimal = decimal.replace(/0+$/, "");
  if (decimal.length === 0) {
    return integer;
  }

  return `${integer}.${decimal}`;
}

export { solNumberToDecimal };
