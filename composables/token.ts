function solNumberToDecimal(amount: string, decimals: number): string {
  let integer: string;
  let decimal: string;

  if (amount.length < decimals) {
    integer = "0";
    const padZeros = decimals - amount.length;
    decimal = `${"0".repeat(padZeros)}${amount}`;
  } else {
    integer = amount.slice(0, -decimals);
    if (integer.length === 0) {
      integer = "0";
    }

    decimal = amount.slice(-decimals);
  }

  // Remove trailing zeros
  decimal = decimal.replace(/0+$/, "");
  if (decimal.length === 0) {
    return integer;
  }

  return `${integer}.${decimal}`;
}

export { solNumberToDecimal };
