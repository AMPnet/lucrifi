function solNumberToDecimal(amount: string, decimals: number): string {
  let integer = amount.slice(0, -decimals);
  if (integer.length === 0) {
    integer = "0";
  }

  let decimal = amount.slice(-decimals);

  // Remove trailing zeros
  decimal = decimal.replace(/0+$/, "");
  if (decimal.length === 0) {
    return integer;
  }

  return `${integer}.${decimal}`;
}

export { solNumberToDecimal };
